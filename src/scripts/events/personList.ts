// Import teacher list
import { generateListPerson } from '@/templates';

// Import constants
import {
  DISPLAY_CLASSES,
  CLASSES,
  TITLE_MODAL,
  ID_ELEMENTS,
  PROFILE_PERSON,
  MESSAGES,
  ICONS,
} from '@/constants';

// Import utils
import {
  attachBlurEventHandlers,
  createToggleDropdown,
  createPerson,
  displayFormErrors,
  displayToastMessage,
  determinePersonType,
  generateModalConfirm,
  generateModalPerson,
  startLoadingSpinner,
  stopLoadingSpinner,
  trailingString,
  validateForm,
} from '@/utils';

// Import interfaces Person data
import { Person, Teacher } from '@/types';

// Definition PersonList class
export class PersonList {
  tableElement: HTMLElement;
  modelDeleteElement: HTMLElement;
  confirmDeleteButton: HTMLElement;
  cancelDeleteButton: HTMLElement;
  closeDeleteModalButton: HTMLElement;
  addPersonHandler: (person: Person) => void;
  editPersonHandler: (personId: string, person: Person) => void;
  deleteHandler: (personId: number) => void;
  getDetailHandler: (personId: number) => void;

  // Method initialize the model delete element
  initModelDeleteElement() {
    this.modelDeleteElement = document.getElementById('modal-confirm');
  }

  // Method to initialize the table element
  initTableElement(tableId: string): void {
    this.tableElement = document.getElementById(tableId);
  }

  // Method to initialize event listeners for the table
  initEventListenersPerson(): void {
    this.tableElement.addEventListener('click', async (event: MouseEvent) => {
      const editButton = (event.target as HTMLElement)?.closest(
        '.dropdown-content button:first-child',
      ) as HTMLElement;
      const deleteButton = (event.target as HTMLElement)?.closest(
        '.dropdown-content button:last-child',
      ) as HTMLElement;

      // Handle action buttons for edit and delete
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
        await handleActionButtonClick(
          editButton,
          this.getDetailHandler.bind(this),
        );

      // Handle delete button click
      if (deleteButton)
        await handleActionButtonClick(
          deleteButton,
          this.showConfirmModal.bind(this),
        );
    });
  }

  // Show confirm modal
  showConfirmModal(personId: number): void {
    this.modelDeleteElement.innerHTML = generateModalConfirm();

    // Get button
    const confirmDeleteButton =
      this.modelDeleteElement.querySelector('#confirm-btn');
    const cancelDeleteButton =
      this.modelDeleteElement.querySelector('#cancel-btn');
    const closeDeleteModalButton = this.modelDeleteElement.querySelector(
      '#close-modal-confirm',
    );

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
    this.modelDeleteElement.style.display = DISPLAY_CLASSES.FLEX;
  }

  // Hide modal confirm
  hideDeleteModal(): void {
    this.modelDeleteElement.style.display = DISPLAY_CLASSES.HIDDEN;
  }

  // Shared modal handler for both Person
  showPersonModal(
    personData: Person | null,
    modalElement: HTMLElement,
    hasAdditionalField: boolean,
  ): void {
    const title = personData ? TITLE_MODAL.EDIT : TITLE_MODAL.ADD;
    const modalContent = generateModalPerson(
      personData,
      title,
      hasAdditionalField,
    );

    // Set the modal's HTML content and display it
    modalElement.innerHTML = modalContent;
    modalElement.style.display = DISPLAY_CLASSES.FLEX;

    // Get references to the close button, cancel button, submit button, and the form
    const closeBtn = modalElement.querySelector(
      ID_ELEMENTS.CLOSE_MODAL,
    ) as HTMLElement;
    const cancelBtn = modalElement.querySelector(
      ID_ELEMENTS.BTN_CANCEL,
    ) as HTMLElement;
    const submitBtn = modalElement.querySelector(
      ID_ELEMENTS.BTN_SUBMIT,
    ) as HTMLElement;
    const formPerson = modalElement.querySelector(
      ID_ELEMENTS.FORM_PERSON,
    ) as HTMLElement;

    // Attach blur event handlers for form validation
    attachBlurEventHandlers();

    // Add event listeners for close button and cancel button clicks
    closeBtn.addEventListener(
      'click',
      this.closeModalHandler.bind(this, modalElement),
    );
    cancelBtn.addEventListener(
      'click',
      this.closeModalHandler.bind(this, modalElement),
    );

    // Save old data if editing
    const oldData = personData && personData;

    // Initialize a flag to track whether changes have been made
    let hasChange = false;

    // Function to get form values
    const getFormValues = () => {
      return {
        name: trailingString(
          (formPerson.querySelector(PROFILE_PERSON.NAME) as HTMLInputElement)
            .value,
        ),

        avatarUrl: trailingString(
          (formPerson.querySelector(PROFILE_PERSON.AVATAR) as HTMLInputElement)
            .value,
        ),

        email: trailingString(
          (formPerson.querySelector(PROFILE_PERSON.EMAIL) as HTMLInputElement)
            .value,
        ),

        className: (
          formPerson.querySelector(PROFILE_PERSON.CLASS) as HTMLSelectElement
        ).value,

        gender: (
          formPerson.querySelector(PROFILE_PERSON.GENDER) as HTMLSelectElement
        ).value,

        subject: hasAdditionalField
          ? trailingString(
              (
                formPerson.querySelector(
                  PROFILE_PERSON.SUBJECT,
                ) as HTMLInputElement
              ).value,
            )
          : '',
      };
    };

    // Function to update hasChange flag
    const updateHasChange = (values: ReturnType<typeof getFormValues>) => {
      hasChange = oldData
        ? values.name !== oldData.name ||
          values.avatarUrl !== oldData.avatarUrl ||
          values.email !== oldData.email ||
          values.className !== oldData.className ||
          values.gender !== oldData.gender ||
          (hasAdditionalField &&
            values.subject !== (oldData as Teacher).subject)
        : true;
    };

    // Add event listeners for input changes to set the hasChange flag
    const formInputs = formPerson.querySelectorAll('input, select');
    formInputs.forEach((input) => {
      input.addEventListener('input', () => {
        const values = getFormValues();
        updateHasChange(values);

        // Enable the submit button when changes are made and the modal is "Edit"
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

    // Handle form submission
    submitBtn.addEventListener('click', async () => {
      const values = getFormValues();

      // // Create a person object using the createPerson function with the provided values
      const person = createPerson({
        id: '',
        name: values.name,
        avatarUrl: values.avatarUrl,
        email: values.email,
        className: values.className,
        gender: values.gender,
        subject: values.subject,
        hasAdditionalField,
      });

      // Clear previous errors
      this.clearErrorMessageForm(modalElement);

      // Validate the form based on the type of person
      const typeObject = determinePersonType(hasAdditionalField);
      const errors = validateForm(person, typeObject);

      // Check if there are any validation errors
      if (Object.entries(errors).length > 0) {
        displayFormErrors(errors);
      } else if (hasChange) {
        this.closeModalHandler(modalElement);

        // Start loading spinner
        startLoadingSpinner();

        const isEdit = !!personData;
        await (isEdit
          ? this.editPersonHandler(personData.id, person)
          : this.addPersonHandler(person));

        // Stop loading spinner
        stopLoadingSpinner();

        // Show success toast message
        displayToastMessage(
          isEdit ? MESSAGES.EDIT_SUCCESS : MESSAGES.ADD_SUCCESS,
          ICONS.SUCCESS,
        );
      }
    });

    // Check if the title matches the Edit modal title
    if (title === TITLE_MODAL.EDIT) {
      submitBtn.setAttribute(
        DISPLAY_CLASSES.DISABLED,
        DISPLAY_CLASSES.DISABLED,
      );
      submitBtn.classList.add(CLASSES.BUTTON_DISABLE);
    }
  }

  // Method to close the modal
  closeModalHandler(modalElement: HTMLElement): void {
    modalElement.style.display = DISPLAY_CLASSES.HIDDEN;
  }

  /**
   * Clear error messages in the form
   */
  clearErrorMessageForm(modalElement: HTMLElement): void {
    const errorFields = [
      'name',
      'avatarUrl',
      'email',
      'className',
      'gender',
      'subject',
    ];
    errorFields.forEach((field) => {
      const errorElement = modalElement.querySelector(`#${field}-error`);
      if (errorElement) errorElement.textContent = '';
    });
  }

  // Bind delete handler
  bindDeleteHandler(handler: (personId: number) => void): void {
    this.deleteHandler = handler;
  }

  // Bind add handler
  bindAddHandler(handler: (person: Person) => void): void {
    this.addPersonHandler = handler;
  }

  // Bind delete handler
  bindEditHandler(handler: (personId: string, person: Person) => void): void {
    this.editPersonHandler = handler;
  }

  // Bind delete handler
  bindGetDetailHandler(handler: (personId: number) => void): void {
    this.getDetailHandler = handler;
  }

  // Generic method to display the person list
  displayPersonList(personData: Person[], isStudent: boolean): void {
    const reversedData = personData.slice().reverse();
    const personListHTML = generateListPerson(reversedData, isStudent);

    this.tableElement.innerHTML = personListHTML;
    this.initDropdownListeners();
  }

  // Common logic for dropdown handling
  initDropdownListeners(): void {
    const dropdownButtons = this.tableElement.querySelectorAll('.btn-dropdown');
    const dropdownContents =
      this.tableElement.querySelectorAll('.dropdown-content');

    const closeDropdowns = (event: MouseEvent) => {
      const isInsideDropdown = Array.from(dropdownContents).some((content) =>
        content.contains(event.target as Node),
      );
      if (!isInsideDropdown) {
        dropdownContents.forEach(
          (content) =>
            ((content as HTMLElement).style.display = DISPLAY_CLASSES.HIDDEN),
        );
      }
    };

    dropdownButtons.forEach((button) => {
      button.addEventListener('click', (event: MouseEvent) => {
        event.stopPropagation();
        const id = (event.target as HTMLElement).getAttribute('data-id');
        const dropdownContent = this.tableElement.querySelector(
          `.dropdown-content[data-id="${id}"]`,
        );
        closeDropdowns(event);
        createToggleDropdown(dropdownContent as HTMLElement);
      });
    });

    document.addEventListener('click', closeDropdowns);
  }
}
