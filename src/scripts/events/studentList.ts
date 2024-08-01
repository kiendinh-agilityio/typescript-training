// Import student list
import { generateListPerson, generateDetailStudent } from '@/templates';

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
  END_POINTS,
  TIMES,
} from '@/constants';

// Import utils
import {
  createToggleDropdown,
  createFilterClass,
  displayFormErrors,
  displayFilterNoResult,
  displayToastMessage,
  generateModalPerson,
  generateModalConfirm,
  modelStudent,
  modelDeleteStudent,
  searchStudent,
  trailingString,
  startLoadingSpinner,
  stopLoadingSpinner,
  validateForm,
} from '@/utils';

// Import class PersonServices
import { PersonServices } from '@/services';

// Definition StudentList class
export class StudentList {
  tableStudent: HTMLElement;
  btnAddStudent: HTMLElement;
  addStudentHandler: (person: Person) => void;
  editStudentHandler: (personId: string, person: Person) => void;
  getDetailStudentHandler: (personId: number) => void;
  confirmDeleteButton: HTMLElement;
  cancelDeleteButton: HTMLElement;
  closeDeleteModalButton: HTMLElement;
  deleteStudentHandler: (personId: number) => void;
  btnSearchStudent: HTMLElement;
  inputSearchStudent: HTMLInputElement;
  clearSearchStudent: HTMLElement;
  studentFilterClass: HTMLElement;
  detailContainer: HTMLElement;
  selectedStudentId: string;

  constructor() {
    this.initElementsStudent();
    this.initEventListenersStudent();
    this.initializeSearchInput();
    this.selectFilterStudent();
    this.selectedStudentId = '';
  }

  /**
   * Initializes the DOM elements.
   */
  initElementsStudent(): void {
    this.tableStudent = document.getElementById('list-student');
    this.btnAddStudent = document.getElementById('btn-add-student');
    this.btnSearchStudent = searchStudent.querySelector('#btn-search-student');
    this.inputSearchStudent = searchStudent.querySelector(
      '#input-search-student',
    );
    this.detailContainer = document.getElementById('detail-infor-student');
  }

  // Initialize event listeners
  initEventListenersStudent(): void {
    this.clearSearchStudent = searchStudent.querySelector(
      '#clear-search-student',
    );

    // Event listener for modal click
    modelStudent.addEventListener('click', (event: MouseEvent) => {
      if (event.target === modelStudent) {
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
      const deleteButton = (event.target as HTMLElement)?.closest(
        '.dropdown-content button:last-child',
      ) as HTMLElement;

      const showDetailInfor = (event.target as HTMLElement)
        ?.closest('[data-id]')
        ?.getAttribute('data-id');

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

      // Handle delete button click
      if (deleteButton)
        await handleActionButtonClick(deleteButton, (personId: number) => {
          this.showConfirmModal(personId);
        });

      // Handle show detail infor student when click
      if (showDetailInfor) {
        this.selectedStudentId = showDetailInfor;

        await this.handleDetailStudent(showDetailInfor);

        this.highlightSelectedRow();
      }
    });

    // Event listener for clear search button click
    this.clearSearchStudent.addEventListener(
      'click',
      this.clearSearchHandler.bind(this),
    );
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
        createToggleDropdown(dropdownContent as HTMLElement);
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
    const modalStudentContent = generateModalPerson(personData, title, false);

    // Set the modal's HTML content and display it
    modelStudent.innerHTML = modalStudentContent;
    modelStudent.style.display = DISPLAY_CLASSES.FLEX;

    // Get references to the close button, cancel button, submit button, and the student form
    const closeBtn = modelStudent.querySelector(
      ID_ELEMENTS.CLOSE_MODAL,
    ) as HTMLElement;
    const cancelBtn = modelStudent.querySelector(
      ID_ELEMENTS.BTN_CANCEL,
    ) as HTMLElement;
    const submitAddStudent = modelStudent.querySelector(
      ID_ELEMENTS.BTN_SUBMIT,
    ) as HTMLElement;
    const formStudent = modelStudent.querySelector(
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
    const formInputs = modelStudent.querySelectorAll('input, select');
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
        displayFormErrors(errors);
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
        displayToastMessage(
          isEditStudent ? MESSAGES.EDIT_SUCCESS : MESSAGES.ADD_SUCCESS,
          ICONS.SUCCESS,
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
    modelStudent.style.display = DISPLAY_CLASSES.HIDDEN;
  }

  /**
   * Clear Error Message for Form
   */
  clearErrorMessageForm(): void {
    const errorFields = ['name', 'avatarUrl', 'email', 'className', 'gender'];

    errorFields.forEach((field: string) => {
      const errorElement = modelStudent.querySelector(`#${field}-error`)!;
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

  // Bind the delete ad handler to the table element
  bindDeleteStudent(handler: (personId: number) => void): void {
    this.deleteStudentHandler = handler;
  }

  // Show confirm modal
  showConfirmModal(personId: number): void {
    modelDeleteStudent.innerHTML = generateModalConfirm();

    // Get button
    const confirmDeleteButton = modelDeleteStudent.querySelector(
      '#confirm-delete',
    ) as HTMLElement;
    const cancelDeleteButton = modelDeleteStudent.querySelector(
      '#cancel-delete',
    ) as HTMLElement;
    const closeDeleteModalButton = modelDeleteStudent.querySelector(
      '#close-modal-confirm',
    ) as HTMLElement;

    // Set data-id attribute for confirm button
    confirmDeleteButton.setAttribute('data-id', personId.toString());

    // Add event listeners
    confirmDeleteButton.addEventListener('click', () => {
      const personId = parseInt(confirmDeleteButton.getAttribute('data-id')!);

      this.hideDeleteModal();
      this.deleteStudentHandler(personId);
    });

    cancelDeleteButton.addEventListener(
      'click',
      this.hideDeleteModal.bind(this),
    );

    closeDeleteModalButton.addEventListener(
      'click',
      this.hideDeleteModal.bind(this),
    );

    // Show modal confirm
    modelDeleteStudent.style.display = DISPLAY_CLASSES.FLEX;
  }

  // Hide modal confirm
  hideDeleteModal(): void {
    modelDeleteStudent.style.display = DISPLAY_CLASSES.HIDDEN;
  }

  // Initialize the search input and its event listeners
  initializeSearchInput(): void {
    let timeSearch: NodeJS.Timeout;

    this.inputSearchStudent.addEventListener('input', () => {
      const inputValue: string = this.inputSearchStudent.value.trim();

      // Clear any existing time
      clearTimeout(timeSearch);

      // Set a new timer to start loading spinner after 1 second
      timeSearch = setTimeout(startLoadingSpinner, TIMES.SPINNER);

      this.clearSearchStudent.style.display = inputValue
        ? DISPLAY_CLASSES.FLEX
        : DISPLAY_CLASSES.HIDDEN;
    });
  }

  // Handle the case when no search results are found
  handleSearchNoResult(): void {
    this.tableStudent.innerHTML = `<p class="search-result-message">${MESSAGES.NO_RESULT}</p>`;
  }

  // Clear the search input
  clearSearchHandler(personData: Person[]): void {
    this.inputSearchStudent.value = '';
    this.clearSearchStudent.style.display = DISPLAY_CLASSES.HIDDEN;

    // Call function to display student list
    this.displayStudentList(personData);
  }

  // Render the select filter for students classes
  selectFilterStudent(): void {
    const filterStudentContainer = document.getElementById('student-filter');
    filterStudentContainer.innerHTML = createFilterClass();

    // Bind the filter class student event
    this.studentFilterClass = document.getElementById('select-filter');
  }

  // Handle the case when filter class no results are found
  handleFilterNoResult(): void {
    this.tableStudent.innerHTML = displayFilterNoResult();
  }

  /**
   * Handles the display of detailed information for a student.
   * @param personId - The ID of the student whose details are to be fetched.
   * @returns A promise that resolves when the details have been successfully displayed.
   */
  async handleDetailStudent(personId: string): Promise<void> {
    const personServices = new PersonServices(END_POINTS.STUDENT);

    // Fetch the details of the student with the specified ID
    const studentDetail = await personServices.getPersonDetail(personId);

    // Generate the HTML for the student's detail view
    const detailHTML = generateDetailStudent(studentDetail);

    // Update the detail container with the generated HTML
    this.detailContainer.innerHTML = detailHTML;
  }

  /**
   * Highlights the selected row by adding a CSS class.
   */
  highlightSelectedRow(): void {
    const tabletStudent = this.tableStudent.querySelectorAll('.table-row');
    tabletStudent.forEach((row) => {
      row.classList.remove('highlighted');
    });

    const selectedRow = this.tableStudent.querySelector(
      `[data-id="${this.selectedStudentId}"]`,
    );

    if (selectedRow) {
      selectedRow.classList.add('highlighted');
    }
  }
}
