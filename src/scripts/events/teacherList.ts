// Import constants
import {
  DISPLAY_CLASSES,
  TITLE_MODAL,
  PROFILE_PERSON,
  ELEMENT_ID,
  CLASS,
} from '@/constants';

// Import teacher list
import { generateListTeacher } from '@/templates';

// Import interfaces Person data
import { Person } from '@/interfaces';

// Import utils
import {
  generateTeacherModal,
  trailingString,
  validateForm,
  showFormErrors,
  modalTeacher,
  toggleDropdown,
} from '@/utils';

// Definition teacherList class
export class TeacherList {
  tableTeacher: HTMLElement;
  btnAdd: HTMLElement;
  addTeacherHandler: (person: Person) => void;
  editTeacherHandler: (teachId: string, person: Person) => void;
  getDetailTeacherHandler: (personId: number) => void;

  constructor() {
    this.initElementsTeacher();
    this.initEventListenersTeacher();
  }

  /**
   * Initializes the DOM elements.
   */
  initElementsTeacher(): void {
    this.tableTeacher = document.getElementById('list-teacher');
    this.btnAdd = document.getElementById('btn-add-teacher');
  }

  // Initialize event listeners
  initEventListenersTeacher(): void {
    // Event listener for modal click
    modalTeacher.addEventListener('click', (event) => {
      if (event.target === modalTeacher) {
        this.closeModalHandler();
      }
    });

    // Event listener for button add click
    this.btnAdd.addEventListener('click', () => {
      this.showTeacherModal(null);
    });

    // Event listener for table element click
    this.tableTeacher.addEventListener('click', async (event) => {
      const editButton = (event.target as HTMLElement)?.closest(
        '.dropdown-content button:first-child',
      ) as HTMLElement;

      // Handle action click for edit and delete
      const handleActionButtonClick = async (
        button: HTMLElement | null,
        action: (id: number) => void | Promise<void>,
      ) => {
        if (button) {
          const dataId = button.getAttribute('data-id');
          if (dataId) await action(parseInt(dataId));
        }
      };

      // Handle edit button click
      if (editButton)
        await handleActionButtonClick(editButton, this.getDetailTeacherHandler);
    });
  }

  /**
   * Displays the list of teacher in the table.
   * @param {Array} teacherData - The list of teacher to be displayed.
   */
  displayTeacherList(teacherData: Person[]): void {
    // Newly added teacher will appear at the top
    const reversedTeacherData = teacherData.slice().reverse();

    // Generate the HTML for the reversed list of teacher
    const teacherListHTML = generateListTeacher(reversedTeacherData);

    // Update the table element's inner HTML with the new teacher list
    this.tableTeacher.innerHTML = teacherListHTML;

    // Dropdown buttons
    const dropdownButtons = this.tableTeacher.querySelectorAll('.btn-dropdown');
    const dropdownContents =
      this.tableTeacher.querySelectorAll('.dropdown-content');

    const closeDropdowns = (event: MouseEvent) => {
      const isInsideDropdown = Array.from(dropdownContents).some((content) =>
        content.contains(event.target as Node),
      );

      if (!isInsideDropdown) {
        const htmlDropdownContents = Array.from(dropdownContents).filter(
          (content): content is HTMLElement => content instanceof HTMLElement,
        );

        htmlDropdownContents.forEach((content) => {
          content.style.display = DISPLAY_CLASSES.HIDDEN;
        });
      }
    };

    dropdownButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const mouseEvent = event as MouseEvent;
        mouseEvent.stopPropagation();
        const id = (mouseEvent.target as HTMLElement).getAttribute('data-id');

        // Find the corresponding dropdown content
        const dropdownContent = this.tableTeacher.querySelector(
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
   * Displays the teacher modal with the provided teacherData.
   * If teacherData is provided, it sets the modal title to 'Edit', otherwise 'Add'.
   * Sets up event listeners for the modal buttons and form inputs.
   * @param {Object} personData - The data of the teacher to be displayed in the modal.
   */
  showTeacherModal(personData: Person): void {
    const title = personData
      ? TITLE_MODAL.EDIT_TEACHER
      : TITLE_MODAL.ADD_TEACHER;
    const modalTeacherContent = generateTeacherModal(personData, title);

    // Set the modal's HTML content and display it
    modalTeacher.innerHTML = modalTeacherContent;
    modalTeacher.style.display = DISPLAY_CLASSES.FLEX;

    // Get references to the close button, cancel button, submit button, and the teacher form
    const closeBtn = modalTeacher.querySelector(
      ELEMENT_ID.CLOSE_MODAL,
    ) as HTMLElement;
    const cancelBtn = modalTeacher.querySelector(
      ELEMENT_ID.BTN_CANCEL,
    ) as HTMLElement;
    const submitBtn = modalTeacher.querySelector(
      ELEMENT_ID.BTN_SUBMIT,
    ) as HTMLElement;
    const formTeacher = modalTeacher.querySelector(
      ELEMENT_ID.FORM_TEACHER,
    ) as HTMLElement;

    // Add event listeners for close button and cancel button clicks
    closeBtn.addEventListener('click', this.closeModalHandler.bind(this));
    cancelBtn.addEventListener('click', this.closeModalHandler.bind(this));

    // Save old data if editing
    const oldData = personData && personData;

    // Initialize a flag to track whether changes have been made
    let hasChange = false;

    // Add event listeners for input changes to set the hasChange flag
    const formInputs = modalTeacher.querySelectorAll('input, select');
    formInputs.forEach((input) => {
      input.addEventListener('input', () => {
        // Compare new values with old values
        const name = trailingString(
          (formTeacher.querySelector(PROFILE_PERSON.NAME) as HTMLInputElement)
            .value,
        );

        const avatarUrl = trailingString(
          (formTeacher.querySelector(PROFILE_PERSON.AVATAR) as HTMLInputElement)
            .value,
        );

        const subject = trailingString(
          (
            formTeacher.querySelector(
              PROFILE_PERSON.SUBJECT,
            ) as HTMLInputElement
          ).value,
        );

        const email = trailingString(
          (formTeacher.querySelector(PROFILE_PERSON.EMAIL) as HTMLInputElement)
            .value,
        );

        const className = (
          formTeacher.querySelector(PROFILE_PERSON.CLASS) as HTMLSelectElement
        ).value;

        const gender = (
          formTeacher.querySelector(PROFILE_PERSON.GENDER) as HTMLSelectElement
        ).value;

        // Check if the new data is different from the old data
        hasChange = oldData
          ? name !== oldData.name ||
            avatarUrl !== oldData.avatarUrl ||
            subject !== oldData.subject ||
            email !== oldData.email ||
            className !== oldData.className ||
            gender !== oldData.gender
          : true;

        // Enable the submit button when changes are made and the modal is "Edit teacher"
        if (title === TITLE_MODAL.EDIT_TEACHER && hasChange) {
          submitBtn.removeAttribute(DISPLAY_CLASSES.DISABLED);
          submitBtn.classList.remove(CLASS.BUTTON_DISABLE);
        } else if (!hasChange) {
          submitBtn.setAttribute(
            DISPLAY_CLASSES.DISABLED,
            DISPLAY_CLASSES.DISABLED,
          );

          submitBtn.classList.add(CLASS.BUTTON_DISABLE);
        }
      });
    });

    // Handle the event of submitting the form
    submitBtn.addEventListener('click', async () => {
      const name = trailingString(
        (formTeacher.querySelector(PROFILE_PERSON.NAME) as HTMLInputElement)
          .value,
      );

      const avatarUrl = trailingString(
        (formTeacher.querySelector(PROFILE_PERSON.AVATAR) as HTMLInputElement)
          .value,
      );

      const subject = trailingString(
        (formTeacher.querySelector(PROFILE_PERSON.SUBJECT) as HTMLInputElement)
          .value,
      );

      const email = trailingString(
        (formTeacher.querySelector(PROFILE_PERSON.EMAIL) as HTMLInputElement)
          .value,
      );

      const className = (
        formTeacher.querySelector(PROFILE_PERSON.CLASS) as HTMLSelectElement
      ).value;

      const gender = (
        formTeacher.querySelector(PROFILE_PERSON.GENDER) as HTMLSelectElement
      ).value;

      const person: Person = {
        id: '',
        name,
        avatarUrl,
        email,
        className,
        gender,
        subject,
      };

      // Clear previous errors
      this.clearErrorMessageForm();

      // Validate the teacher and show errors if any
      const errors = validateForm(person);
      if (Object.entries(errors).length > 0) {
        showFormErrors(errors);
      } else if (hasChange) {
        personData
          ? await this.editTeacherHandler(personData.id, person)
          : await this.addTeacherHandler(person);

        this.closeModalHandler();
      }
    });

    if (title === TITLE_MODAL.EDIT_TEACHER) {
      submitBtn.setAttribute(
        DISPLAY_CLASSES.DISABLED,
        DISPLAY_CLASSES.DISABLED,
      );
      submitBtn.classList.add(CLASS.BUTTON_DISABLE);
    }
  }

  /**
   * Binds the handler for adding new teacher.
   * @param {Function} handler - The handler function for adding teacher.
   */
  bindAddTeacher(handler: (person: Person) => void): void {
    this.addTeacherHandler = handler;
  }

  /**
   * Binds the handler for editing existing teacher.
   * @param {Function} handler - The handler function for editing teacher.
   */

  bindEditTeacher(handler: (personId: string, person: Person) => void): void {
    this.editTeacherHandler = handler;
  }

  // Close the modal
  closeModalHandler(): void {
    modalTeacher.style.display = DISPLAY_CLASSES.HIDDEN;
  }

  /**
   * Clear Error Message for Form
   */
  clearErrorMessageForm(): void {
    const errorFields = [
      'name',
      'avatarUrl',
      'email',
      'subject',
      'className',
      'gender',
    ];

    errorFields.forEach((field) => {
      const errorElement = modalTeacher.querySelector(`#${field}-error`)!;
      errorElement.textContent = '';
    });
  }

  // Bind the handler for getting detail of an teacher
  bindGetDetailTeacher(handler: (personId: number) => void): void {
    this.getDetailTeacherHandler = handler;
  }
}
