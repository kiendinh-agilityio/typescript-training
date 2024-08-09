// Import constants
import {
  DISPLAY_CLASSES,
  TITLE_MODAL,
  PROFILE_PERSON,
  ID_ELEMENTS,
  CLASSES,
  MESSAGES,
  TIMES,
  ICONS,
} from '@/constants';

// Import teacher list
import { generateListPerson } from '@/templates';

// Import interfaces Person data
import { Person, Teacher, PersonType } from '@/types';

// Import utils
import {
  createFilterClass,
  createToggleDropdown,
  displayFilterNoResult,
  displayFormErrors,
  displayToastMessage,
  generateModalConfirm,
  generateModalPerson,
  modelDeleteTeacher,
  modelTeacher,
  searchTeacher,
  trailingString,
  startLoadingSpinner,
  stopLoadingSpinner,
  validateForm,
} from '@/utils';

// Definition teacherList class
export class TeacherList {
  tableTeacher: HTMLElement;
  btnAdd: HTMLElement;
  addTeacherHandler: (person: Person) => void;
  editTeacherHandler: (teachId: string, person: Person) => void;
  getDetailTeacherHandler: (personId: number) => void;
  confirmDeleteButton: HTMLElement;
  cancelDeleteButton: HTMLElement;
  closeDeleteModalButton: HTMLElement;
  deleteHandler: (personId: number) => void;
  btnSearchTeacher: HTMLElement;
  inputSearchTeacher: HTMLInputElement;
  clearSearchTeacher: HTMLElement;
  teacherFilterClass: HTMLElement;

  constructor() {
    this.initElementsTeacher();
    this.initEventListenersTeacher();
    this.initializeSearchInput();
    this.selectFilterTeacher();
  }

  /**
   * Initializes the DOM elements.
   */
  initElementsTeacher(): void {
    this.tableTeacher = document.getElementById('list-teacher');
    this.btnAdd = document.getElementById('btn-add-teacher');
    this.btnSearchTeacher = searchTeacher.querySelector('#btn-search-teacher');
    this.inputSearchTeacher = searchTeacher.querySelector(
      '#input-search-teacher',
    );
  }

  // Initialize event listeners
  initEventListenersTeacher(): void {
    this.clearSearchTeacher = searchTeacher.querySelector(
      '#clear-search-teacher',
    );

    // Event listener for modal click
    modelTeacher.addEventListener('click', (event: MouseEvent) => {
      if (event.target === modelTeacher) {
        this.closeModalHandler();
      }
    });

    // Event listener for button add click
    this.btnAdd.addEventListener('click', () => {
      this.showTeacherModal(null);
    });

    // Event listener for clear search button click
    this.clearSearchTeacher.addEventListener(
      'click',
      this.clearSearchHandler.bind(this),
    );

    // Event listener for table element click
    this.tableTeacher.addEventListener('click', async (event: MouseEvent) => {
      const editButton = (event.target as HTMLElement)?.closest(
        '.dropdown-content button:first-child',
      ) as HTMLElement;
      const deleteButton = (event.target as HTMLElement)?.closest(
        '.dropdown-content button:last-child',
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
        await handleActionButtonClick(editButton, this.getDetailTeacherHandler);

      // Handle delete button click
      if (deleteButton)
        await handleActionButtonClick(deleteButton, (personId: number) => {
          this.showConfirmModal(personId);
        });
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
    const teacherListHTML = generateListPerson(reversedTeacherData, false);

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
        const dropdownContent = this.tableTeacher.querySelector(
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
   * Displays the teacher modal with the provided teacherData.
   * If teacherData is provided, it sets the modal title to 'Edit', otherwise 'Add'.
   * Sets up event listeners for the modal buttons and form inputs.
   * @param {Object} personData - The data of the teacher to be displayed in the modal.
   */
  showTeacherModal(personData: Person): void {
    const title = personData ? TITLE_MODAL.EDIT : TITLE_MODAL.ADD;
    const modalTeacherContent = generateModalPerson(personData, title);

    // Set the modal's HTML content and display it
    modelTeacher.innerHTML = modalTeacherContent;
    modelTeacher.style.display = DISPLAY_CLASSES.FLEX;

    // Get references to the close button, cancel button, submit button, and the teacher form
    const closeBtn = modelTeacher.querySelector(
      ID_ELEMENTS.CLOSE_MODAL,
    ) as HTMLElement;
    const cancelBtn = modelTeacher.querySelector(
      ID_ELEMENTS.BTN_CANCEL,
    ) as HTMLElement;
    const submitBtn = modelTeacher.querySelector(
      ID_ELEMENTS.BTN_SUBMIT,
    ) as HTMLElement;
    const formTeacher = modelTeacher.querySelector(
      ID_ELEMENTS.FORM_PERSON,
    ) as HTMLElement;

    // Add event listeners for close button and cancel button clicks
    closeBtn.addEventListener('click', this.closeModalHandler.bind(this));
    cancelBtn.addEventListener('click', this.closeModalHandler.bind(this));

    // Save old data if editing
    const oldData = personData && personData;

    // Initialize a flag to track whether changes have been made
    let hasChange = false;

    // Add event listeners for input changes to set the hasChange flag
    const formInputs = modelTeacher.querySelectorAll('input, select');
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
            subject !== (oldData as Teacher).subject ||
            email !== oldData.email ||
            className !== oldData.className ||
            gender !== oldData.gender
          : true;

        // Enable the submit button when changes are made and the modal is "Edit teacher"
        if (title === TITLE_MODAL.EDIT && hasChange) {
          submitBtn.removeAttribute(DISPLAY_CLASSES.DISABLED);
          submitBtn.classList.remove(CLASSES.BUTTON_DISABLE);
        } else if (!hasChange) {
          submitBtn.setAttribute(
            DISPLAY_CLASSES.DISABLED,
            DISPLAY_CLASSES.DISABLED,
          );

          submitBtn.classList.add(CLASSES.BUTTON_DISABLE);
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

      const person: Teacher = {
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
      const errors = validateForm(person, PersonType.Teacher);
      if (Object.entries(errors).length > 0) {
        displayFormErrors(errors);
      } else if (hasChange) {
        // Close the modal
        this.closeModalHandler();

        // Start the spinner
        startLoadingSpinner();

        // Determine whether this operation is an edit or an add
        const isEditTeacher = !!personData;

        // Perform the appropriate action: edit or add teacher
        await (isEditTeacher
          ? this.editTeacherHandler(personData.id, person)
          : this.addTeacherHandler(person));

        // Stop the spinner
        stopLoadingSpinner();

        // Show success toast message add or edit
        displayToastMessage(
          isEditTeacher ? MESSAGES.EDIT_SUCCESS : MESSAGES.ADD_SUCCESS,
          ICONS.SUCCESS,
        );
      }
    });

    if (title === TITLE_MODAL.EDIT) {
      submitBtn.setAttribute(
        DISPLAY_CLASSES.DISABLED,
        DISPLAY_CLASSES.DISABLED,
      );
      submitBtn.classList.add(CLASSES.BUTTON_DISABLE);
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
    modelTeacher.style.display = DISPLAY_CLASSES.HIDDEN;
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

    errorFields.forEach((field: string) => {
      const errorElement = modelTeacher.querySelector(`#${field}-error`)!;
      errorElement.textContent = '';
    });
  }

  // Bind the handler for getting detail of an teacher
  bindGetDetailTeacher(handler: (personId: number) => void): void {
    this.getDetailTeacherHandler = handler;
  }

  // Bind the delete ad handler to the table element
  bindDeleteTeacher(handler: (personId: number) => void): void {
    this.deleteHandler = handler;
  }

  // Show confirm modal
  showConfirmModal(personId: number): void {
    modelDeleteTeacher.innerHTML = generateModalConfirm();

    // Get button
    const confirmDeleteButton = modelDeleteTeacher.querySelector(
      '#confirm-delete',
    ) as HTMLElement;
    const cancelDeleteButton = modelDeleteTeacher.querySelector(
      '#cancel-delete',
    ) as HTMLElement;
    const closeDeleteModalButton = modelDeleteTeacher.querySelector(
      '#close-modal-confirm',
    ) as HTMLElement;

    // Set data-id attribute for confirm button
    confirmDeleteButton.setAttribute('data-id', personId.toString());

    // Add event listeners
    confirmDeleteButton.addEventListener('click', () => {
      const personId = parseInt(confirmDeleteButton.getAttribute('data-id')!);
      this.hideDeleteModal();
      this.deleteHandler(personId);
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
    modelDeleteTeacher.style.display = DISPLAY_CLASSES.FLEX;
  }

  // Hide modal confirm
  hideDeleteModal(): void {
    modelDeleteTeacher.style.display = DISPLAY_CLASSES.HIDDEN;
  }

  // Initialize the search input and its event listeners
  initializeSearchInput(): void {
    let timeSearch: NodeJS.Timeout;

    this.inputSearchTeacher.addEventListener('input', () => {
      const inputValue = this.inputSearchTeacher.value.trim();

      // Clear any existing time
      clearTimeout(timeSearch);

      // Set a new timer to start loading spinner after 1 second
      timeSearch = setTimeout(startLoadingSpinner, TIMES.SPINNER);

      this.clearSearchTeacher.style.display = inputValue
        ? DISPLAY_CLASSES.FLEX
        : DISPLAY_CLASSES.HIDDEN;
    });
  }

  // Handle the case when no search results are found
  handleSearchNoResult(): void {
    this.tableTeacher.innerHTML = `<p class="search-result-message">${MESSAGES.NO_RESULT}</p>`;
  }

  // Clear the search input
  clearSearchHandler(personData: Person[]): void {
    this.inputSearchTeacher.value = '';
    this.clearSearchTeacher.style.display = DISPLAY_CLASSES.HIDDEN;

    // Call function to display teacher list
    this.displayTeacherList(personData);
  }

  // Render the select filter for teachers classes
  selectFilterTeacher(): void {
    const filterTeacherContainer = document.getElementById('teacher-filter');
    filterTeacherContainer.innerHTML = createFilterClass();

    // Bind the filter class teacher event
    this.teacherFilterClass = document.getElementById('select-filter');
  }

  // Handle the case when filter class no results are found
  handleFilterNoResult(): void {
    this.tableTeacher.innerHTML = displayFilterNoResult(PersonType.Teacher);
  }
}
