// Import student list
import { generateListPerson } from '@/templates';

// Import interfaces Person data
import { Person } from '@/interfaces';

// Import enums
import { PersonType } from '@/enums';

// Import constants
import {
  DISPLAY_CLASSES,
  TITLE_MODAL,
  PROFILE_PERSON,
  ID_ELEMENTS,
  CLASSES,
  MESSAGES,
  ICONS,
} from '@/constants';

// Import utils
import {
  generatePersonModal,
  trailingString,
  validateForm,
  showFormErrors,
  modalStudent,
  startLoadingSpinner,
  stopLoadingSpinner,
  showToast,
  toggleDropdown,
} from '@/utils';

// Definition StudentList class
export class StudentList {
  tableStudent: HTMLElement;
  btnAddStudent: HTMLElement;
  addStudentHandler: (person: Person) => void;
  editStudentHandler: (personId: string, person: Person) => void;
  getDetailStudentHandler: (personId: number) => void;

  constructor() {
    this.initElementsStudent();
    this.initEventListenersStudent();
  }

  /**
   * Initializes the DOM elements.
   */
  initElementsStudent(): void {
    this.tableStudent = document.getElementById('list-student');
    this.btnAddStudent = document.getElementById('btn-add-student');
  }

  // Initialize event listeners
  initEventListenersStudent(): void {
    // Event listener for modal click
    modalStudent.addEventListener('click', (event: MouseEvent) => {
      if (event.target === modalStudent) {
        this.closeModalHandler();
      }
    });

    // Event listener for button add click
    this.btnAddStudent.addEventListener('click', () => {
      this.showStudentModal(null);
    });

    // Event listener for table element click
    this.tableStudent.addEventListener('click', async (event: MouseEvent) => {
      const editButton = (event.target as HTMLElement)?.closest(
        '.dropdown-content button:first-child',
      ) as HTMLElement;

      // Handle action click for edit and delete
      const handleActionButtonClick = async (
        button: HTMLElement,
        action: (id: number) => void | Promise<void>,
      ) => {
        if (button) {
          const dataId = button.getAttribute('data-id');
          if (dataId) await action(parseInt(dataId));
        }
      };

      // Handle edit button click
      if (editButton)
        await handleActionButtonClick(editButton, this.getDetailStudentHandler);
    });
  }

  /**
   * Displays the list of student in the table.
   * @param {Array} studentData - The list of student to be displayed.
   */
  displayStudentList(studentData: Person[]): void {
    // Newly added student will appear at the top
    const reversedStudentData = studentData.slice().reverse();

    // Generate the HTML for the reversed list of student
    const studentListHTML = generateListPerson(reversedStudentData, true);

    // Update the table element's inner HTML with the new student list
    this.tableStudent.innerHTML = studentListHTML;

    // Dropdown buttons
    const dropdownButtons = this.tableStudent.querySelectorAll('.btn-dropdown');
    const dropdownContents =
      this.tableStudent.querySelectorAll('.dropdown-content');

    const closeDropdowns = (event: MouseEvent) => {
      const isInsideDropdown = Array.from(dropdownContents).some((content) =>
        content.contains(event.target as Node),
      );

      if (!isInsideDropdown) {
        const htmlDropdownContents = Array.from(dropdownContents).filter(
          (content): content is HTMLElement => content instanceof HTMLElement,
        );

        htmlDropdownContents.forEach(
          (content) => (content.style.display = DISPLAY_CLASSES.HIDDEN),
        );
      }
    };

    dropdownButtons.forEach((button) => {
      button.addEventListener('click', (event: MouseEvent) => {
        const mouseEvent = event as MouseEvent;
        mouseEvent.stopPropagation();
        const id = (mouseEvent.target as HTMLElement).getAttribute('data-id');

        // Find the corresponding dropdown content
        const dropdownContent = this.tableStudent.querySelector(
          `.dropdown-content[data-id="${id}"]`,
        );

        // Hide other dropdown contents
        closeDropdowns(mouseEvent);

        // Toggle the selected dropdown content
        toggleDropdown(dropdownContent as HTMLElement);
      });
    });

    document.addEventListener('click', closeDropdowns);
  }

  /**
   * Displays the student modal with the provided studentData.
   * If studentData is provided, it sets the modal title to 'Edit', otherwise 'Add'.
   * Sets up event listeners for the modal buttons and form inputs.
   * @param {Object} personData - The data of the student to be displayed in the modal.
   */
  showStudentModal(personData: Person): void {
    const title = personData ? TITLE_MODAL.EDIT : TITLE_MODAL.ADD;
    const modalStudentContent = generatePersonModal(personData, title, false);

    // Set the modal's HTML content and display it
    modalStudent.innerHTML = modalStudentContent;
    modalStudent.style.display = DISPLAY_CLASSES.FLEX;

    // Get references to the close button, cancel button, submit button, and the student form
    const closeBtn = modalStudent.querySelector(
      ID_ELEMENTS.CLOSE_MODAL,
    ) as HTMLElement;
    const cancelBtn = modalStudent.querySelector(
      ID_ELEMENTS.BTN_CANCEL,
    ) as HTMLElement;
    const submitAddStudent = modalStudent.querySelector(
      ID_ELEMENTS.BTN_SUBMIT,
    ) as HTMLElement;
    const formStudent = modalStudent.querySelector(
      ID_ELEMENTS.FORM_PERSON,
    ) as HTMLElement;

    // Add event listeners for close button and cancel button clicks
    closeBtn.addEventListener('click', this.closeModalHandler.bind(this));
    cancelBtn.addEventListener('click', this.closeModalHandler.bind(this));

    // Save old data if editing
    const saveOldData = personData && personData;

    // Initialize a flag to track whether changes have been made
    let hasChange = false;

    // Add event listeners for input changes to set the hasChange flag
    const formInputs = modalStudent.querySelectorAll('input, select');
    formInputs.forEach((input) => {
      input.addEventListener('input', () => {
        // Compare new values with old values
        const name = trailingString(
          (formStudent.querySelector(PROFILE_PERSON.NAME) as HTMLInputElement)
            .value,
        );

        const avatarUrl = trailingString(
          (formStudent.querySelector(PROFILE_PERSON.AVATAR) as HTMLInputElement)
            .value,
        );

        const email = trailingString(
          (formStudent.querySelector(PROFILE_PERSON.EMAIL) as HTMLInputElement)
            .value,
        );

        const className = (
          formStudent.querySelector(PROFILE_PERSON.CLASS) as HTMLSelectElement
        ).value;

        const gender = (
          formStudent.querySelector(PROFILE_PERSON.GENDER) as HTMLSelectElement
        ).value;

        // Check if the new data is different from the old data
        hasChange = saveOldData
          ? name !== saveOldData.name ||
            avatarUrl !== saveOldData.avatarUrl ||
            email !== saveOldData.email ||
            className !== saveOldData.className ||
            gender !== saveOldData.gender
          : true;

        // Enable the submit button when changes are made and the modal is "Edit student"
        if (title === TITLE_MODAL.EDIT && hasChange) {
          submitAddStudent.removeAttribute(DISPLAY_CLASSES.DISABLED);
          submitAddStudent.classList.remove(CLASSES.BUTTON_DISABLE);
        } else if (!hasChange) {
          submitAddStudent.setAttribute(
            DISPLAY_CLASSES.DISABLED,
            DISPLAY_CLASSES.DISABLED,
          );

          submitAddStudent.classList.add(CLASSES.BUTTON_DISABLE);
        }
      });
    });

    // Handle the event of submitting the form
    submitAddStudent.addEventListener('click', async () => {
      const name = trailingString(
        (formStudent.querySelector(PROFILE_PERSON.NAME) as HTMLInputElement)
          .value,
      );

      const avatarUrl = trailingString(
        (formStudent.querySelector(PROFILE_PERSON.AVATAR) as HTMLInputElement)
          .value,
      );

      const email = trailingString(
        (formStudent.querySelector(PROFILE_PERSON.EMAIL) as HTMLInputElement)
          .value,
      );

      const className = (
        formStudent.querySelector(PROFILE_PERSON.CLASS) as HTMLSelectElement
      ).value;

      const gender = (
        formStudent.querySelector(PROFILE_PERSON.GENDER) as HTMLSelectElement
      ).value;

      const person: Person = {
        id: '',
        name,
        avatarUrl,
        email,
        className,
        gender,
      };

      // Clear previous errors
      this.clearErrorMessageForm();

      // Validate the student and show errors
      const errors = validateForm(person, PersonType.Student);

      if (Object.entries(errors).length > 0) {
        showFormErrors(errors);
      } else if (hasChange) {
        // Close the modal
        this.closeModalHandler();

        // Start the spinner
        startLoadingSpinner();

        // Determine whether this operation is an edit or an add
        const isEditStudent = !!personData;

        // Perform the appropriate action: edit or add student
        await (isEditStudent
          ? this.editStudentHandler(personData.id, person)
          : this.addStudentHandler(person));

        // Stop the spinner
        stopLoadingSpinner();

        // Show success toast message add or edit
        showToast(
          isEditStudent ? MESSAGES.EDIT_SUCCESS : MESSAGES.ADD_SUCCESS,
          ICONS.SUCCESS,
          true,
        );
      }
    });

    if (title === TITLE_MODAL.EDIT) {
      submitAddStudent.setAttribute(
        DISPLAY_CLASSES.DISABLED,
        DISPLAY_CLASSES.DISABLED,
      );

      submitAddStudent.classList.add(CLASSES.BUTTON_DISABLE);
    }
  }

  /**
   * Binds the handler for adding new student.
   * @param {Function} handler - The handler function for adding student.
   */
  bindAddStudent(handler: (person: Person) => void): void {
    this.addStudentHandler = handler;
  }

  // Close the modal
  closeModalHandler(): void {
    modalStudent.style.display = DISPLAY_CLASSES.HIDDEN;
  }

  /**
   * Clear Error Message for Form
   */
  clearErrorMessageForm(): void {
    const errorFields = ['name', 'avatarUrl', 'email', 'className', 'gender'];

    errorFields.forEach((field: string) => {
      const errorElement = modalStudent.querySelector(`#${field}-error`)!;
      errorElement.textContent = '';
    });
  }

  /**
   * Binds the handler for editing existing student.
   * @param {Function} handler - The handler function for editing student.
   */
  bindEditStudent(handler: (personId: string, person: Person) => void): void {
    this.editStudentHandler = handler;
  }

  // Bind the handler for getting detail of an student
  bindGetDetailStudent(handler: (personId: number) => void): void {
    this.getDetailStudentHandler = handler;
  }
}
