// Import ads List
import { generateListAds } from '@/templates';

// Import interfaces Ads Data
import { AdsData } from '@/interfaces';

// Import constants
import { DISPLAY_CLASS, TITLE_MODAL, PROFILE_ADS, ELEMENT_ID, MESSAGES } from '@/constants';

// Import utils
import {
  generateModalAds,
  toggleDropdown,
  formatLimitedPhoneNumberInput,
  strimmingString,
  adsSearchElement,
} from '@/utils';

// Import validate form
import { validateAdsForm, showFormErrors } from '@/validate';

/*
 * AdsView class definition
*/
export class AdsView {
  modalAds: HTMLElement;
  btnAdd: HTMLButtonElement;
  tableElement: HTMLElement;
  searchButton: HTMLElement;
  searchInput: HTMLInputElement;
  btnClearSearch: HTMLElement;
  addAdsHandler: ((adsItem: AdsData) => void) | null;
  editAdsHandler: ((adsId: string, adsItem: AdsData) => void) | null;
  getDetailAdsHandler: ((adsId: number) => void) | null;
  deleteModal: HTMLElement;
  confirmDeleteButton: HTMLElement;
  cancelDeleteButton: HTMLElement;
  closeDeleteModalButton: HTMLElement;
  deleteHandler: ((adsId: number) => void) | null;

  // Constructor
  constructor() {
    this.initElementsAds();
    this.initEventListenersAds();
    this.addAdsHandler = null;
    this.editAdsHandler = null;
    this.getDetailAdsHandler = null;
    this.initializeSearchInput();
    this.deleteHandler = null;
  }

  /**
    * Initializes the DOM elements used by AdsView.
  */
  initElementsAds(): void {
    // Retrieve DOM elements
    this.modalAds = document.getElementById('modal')!;
    this.btnAdd = document.getElementById('btn-add') as HTMLButtonElement;
    this.tableElement = document.getElementById('list-ads')!;
    this.searchButton = adsSearchElement.querySelector('#search-button')!;
    this.searchInput = adsSearchElement.querySelector('#search-input') as HTMLInputElement;
    this.btnClearSearch = adsSearchElement.querySelector('#btn-clear-search')!;
    this.deleteModal = document.getElementById('delete-modal')!;
    this.confirmDeleteButton = this.deleteModal.querySelector('#confirm-delete')!;
    this.cancelDeleteButton = this.deleteModal.querySelector('#cancel-delete')!;
    this.closeDeleteModalButton = this.deleteModal.querySelector('#close-modal')!;
  }

  // Initialize event listeners for AdsView
  initEventListenersAds(): void {
    // Event listener for modal click
    this.modalAds.addEventListener('click', (event) => {
      if (event.target === this.modalAds) {
        this.closeModalHandler();
      }
    });

    // Event listener for button add click
    this.btnAdd.addEventListener('click', () => {
      this.showAdsModal(null);
    });

    // Event listener for clear search button click
    this.btnClearSearch.addEventListener(
'click',
      this.clearSearchHandler.bind(this),
    );

    // Event listener for table element click
    this.tableElement.addEventListener('click', async (event) => {
      const editButton = (event.target as HTMLElement)?.closest('.dropdown-content button:first-child') as HTMLElement | null;
      const deleteButton = (event.target as HTMLElement)?.closest('.dropdown-content button:last-child') as HTMLElement | null;

      // Handle action click for edit and delete
      const handleActionButtonClick = async (button: HTMLElement | null, action: (id: number) => void | Promise<void>) => {
        if (button) {
          const dataId = button.getAttribute('data-id');
          if (dataId) await action(parseInt(dataId));
        }
      };

      // Handle edit button click
      if (editButton) await handleActionButtonClick(editButton, this.getDetailAdsHandler!);

      // Handle delete button click
      if (deleteButton) await handleActionButtonClick(deleteButton, (adsId: number) => {
        this.showDeleteModal(adsId);
        this.bindDeleteAdsHandler(adsId);
      });
    });

    // Event listener for confirm delete button
    this.confirmDeleteButton.addEventListener('click', () => {
      const adsId = parseInt(this.confirmDeleteButton.getAttribute('data-id')!);
      this.hideDeleteModal();
      this.deleteHandler(adsId);
    });

    // Event listener for cancel delete button
    this.cancelDeleteButton.addEventListener('click', () => {
      this.hideDeleteModal();
    });

    // Event listener for close delete modal button
    this.closeDeleteModalButton.addEventListener('click', () => {
      this.hideDeleteModal();
    });

    // Event listener for click outside delete modal
    this.deleteModal.addEventListener('click', (event) => {
    if (event.target === this.deleteModal) {
        this.hideDeleteModal();
      }
    });
  }

  /**
   * Displays the Ads modal with the provided adsData.
   * If adsData is provided, it sets the modal title to 'Edit', otherwise 'Add'.
   * Sets up event listeners for the modal buttons and form inputs.
   * @param {Object} adsData - The data of the ad to be displayed in the modal.
   */
  showAdsModal(adsData: AdsData | null): void {
    const title = adsData ? TITLE_MODAL.EDIT : TITLE_MODAL.ADD;
    const modalContent = generateModalAds(adsData, title);

     // Set the modal's HTML content and display it
    this.modalAds.innerHTML = modalContent;
    this.modalAds.style.display = DISPLAY_CLASS.FLEX;

    // Get references to the close button, cancel button, submit button, and the ads form
    const closeBtn = this.modalAds.querySelector(ELEMENT_ID.CLOSE_MODAL_ADS)! as HTMLElement;
    const cancelBtn = this.modalAds.querySelector(ELEMENT_ID.BTN_CANCEL)! as HTMLElement;
    const submitBtn = this.modalAds.querySelector(ELEMENT_ID.BTN_SUBMIT)! as HTMLElement;
    const formAds = this.modalAds.querySelector(ELEMENT_ID.FORM_ADS)! as HTMLElement;

    // Add event listeners for close button and cancel button clicks
    closeBtn.addEventListener('click', this.closeModalHandler.bind(this));
    cancelBtn.addEventListener('click', this.closeModalHandler.bind(this));

    // Handle the event of formatting phone number input
    const phoneInput = formAds.querySelector(PROFILE_ADS.PHONE) as HTMLInputElement;
    phoneInput.addEventListener('input', formatLimitedPhoneNumberInput);

    // Initialize a flag to track whether changes have been made
    let changesMade = false;

    // Add event listeners for input changes to set the changesMade flag
    const formInputs = this.modalAds.querySelectorAll('input, select');
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        changesMade = true;

        // Enable the submit button when changes are made and the modal is "Edit Ads"
        title === TITLE_MODAL.EDIT && submitBtn.removeAttribute(DISPLAY_CLASS.DISABLED);
      });
    });

    // Handle the event of submitting the form
    submitBtn.addEventListener('click', async () => {
      const network = strimmingString((formAds.querySelector(PROFILE_ADS.NETWORK) as HTMLInputElement).value);
      const link = strimmingString((formAds.querySelector(PROFILE_ADS.LINK) as HTMLInputElement).value);
      const email = strimmingString((formAds.querySelector(PROFILE_ADS.EMAIL) as HTMLInputElement).value);
      const phone = strimmingString(phoneInput.value);
      const status = (formAds.querySelector(PROFILE_ADS.STATUS_TYPE) as HTMLSelectElement).value;

      const adsItem: AdsData = {
        id: '',
        network,
        link,
        email,
        phone,
        status,
        statusID: '',
      };

      // Clear previous errors
      this.clearErrorMessageForm();

      // Validate the adsItem and show errors if any
      const errors = validateAdsForm(adsItem);
      if (Object.entries(errors).length > 0) {
        showFormErrors(errors);
      } else if (changesMade) {
        adsData ? await this.editAdsHandler!(adsData.id, adsItem) : await this.addAdsHandler!(adsItem);
        this.closeModalHandler();
      }
    });

    title === TITLE_MODAL.EDIT && submitBtn.setAttribute(DISPLAY_CLASS.DISABLED, DISPLAY_CLASS.DISABLED);
  }

  /**
   * Binds the handler for adding new ads.
   * @param {Function} handler - The handler function for adding ads.
   */
  bindAddAds(handler: (adsItem: AdsData) => void): void {
    this.addAdsHandler = handler;
  }

  /**
   * Binds the handler for editing existing ads.
   * @param {Function} handler - The handler function for editing ads.
   */
  bindEditAds(handler: (adsId: string, adsItem: AdsData) => void): void {
    this.editAdsHandler = handler;
  }

  // Bind the handler for getting detail of an ad
  bindGetDetailAds(handler: (adsId: number) => void): void {
    this.getDetailAdsHandler = handler;
  }

  // Close the modal
  closeModalHandler(): void {
    this.modalAds.style.display = DISPLAY_CLASS.HIDDEN;
  }

  /**
   * Displays the list of ads in the table.
   * @param {Array} adsData - The list of ads to be displayed.
   */
  displayAdsList(adsData: AdsData[]): void {
    const adsListHTML = generateListAds(adsData);
    this.tableElement.innerHTML = adsListHTML;

    // Dropdown buttons
    const dropdownButtons = this.tableElement.querySelectorAll('.btn-dropdown');
    const dropdownContents = this.tableElement.querySelectorAll('.dropdown-content');

    const closeDropdowns = (event: MouseEvent) => {
      const isInsideDropdown = Array.from(dropdownContents).some((content) =>
        content.contains(event.target as Node),
      );

      if (!isInsideDropdown) {
        const htmlDropdownContents = Array.from(dropdownContents).filter((content): content is HTMLElement => content instanceof HTMLElement);

        htmlDropdownContents.forEach((content) => {
          content.style.display = DISPLAY_CLASS.HIDDEN;
        });
      }
    };

    dropdownButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const mouseEvent = event as MouseEvent;
        mouseEvent.stopPropagation();
        const id = (mouseEvent.target as HTMLElement).getAttribute('data-id');

        // Find the corresponding dropdown content
        const dropdownContent = this.tableElement.querySelector(
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
   * Clear Error Message for Form
   */
  clearErrorMessageForm(): void {
    const errorFields = ['network', 'link', 'email', 'phone', 'status'];

    errorFields.forEach((field) => {
      const errorElement = this.modalAds.querySelector(`#${field}-error`)!;
      errorElement.textContent = '';
    });
  }

  // Initialize the search input and its event listeners
  initializeSearchInput(): void {
    this.searchInput.addEventListener('input', () => {
      const inputValue = this.searchInput.value.trim();
      this.btnClearSearch.style.display = inputValue
        ? DISPLAY_CLASS.FLEX
        : DISPLAY_CLASS.HIDDEN;
    });
  }

  // Handle the case when no search results are found
  handleSearchNoResult(): void {
    this.tableElement.innerHTML = `<p class="search-result-message">${MESSAGES.NO_RESULT}</p>`;
  }

  // Clear the search input
  clearSearchHandler(adsData: AdsData[]): void {
    this.searchInput.value = '';
    this.btnClearSearch.style.display = DISPLAY_CLASS.HIDDEN;
    // Call function to display ads list
    this.displayAdsList(adsData);
  }

  // Bind the delete ad handler to the confirmation modal buttons
  bindDeleteAdsHandler(adsId: number): void {
    this.confirmDeleteButton.setAttribute('data-id', adsId.toString());
    this.showDeleteModal();
  }

  // Bind the delete ad handler to the table element
  bindDeleteAds(handler: (adsId: number) => void): void {
    this.deleteHandler = handler;
  }

  // Display the delete modal
  showDeleteModal(): void {
    this.deleteModal.style.display = DISPLAY_CLASS.FLEX;
  }

  // Hide the delete modal
  hideDeleteModal(): void {
    this.deleteModal.style.display = DISPLAY_CLASS.HIDDEN;
  }
}
