// Import constants
import { DISPLAY_CLASSES, MESSAGES, TIMES } from '@/constants';

// Import interfaces Person data
import { Person, PersonType } from '@/types';

// Import utils
import {
  createFilterClass,
  displayFilterNoResult,
  modelTeacher,
  searchTeacher,
  startLoadingSpinner,
} from '@/utils';

// Import class PersonList
import { PersonList } from '@/events';

// Definition teacherList class
export class TeacherList extends PersonList {
  btnAdd: HTMLElement;
  btnSearchTeacher: HTMLElement;
  inputSearchTeacher: HTMLInputElement;
  clearSearchTeacher: HTMLElement;
  teacherFilterClass: HTMLElement;

  constructor() {
    super('modal-confirm-teacher');
    this.initTableElement('list-teacher');
    this.initElementsTeacher();
    this.initEventListenersTeacher();
    this.initEventListenersPerson();
    this.initializeSearchInput();
    this.selectFilterTeacher();
  }

  /**
   * Initializes the DOM elements.
   */
  initElementsTeacher(): void {
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

    // Event listener for button add click
    this.btnAdd.addEventListener('click', () => {
      this.showTeacherModal(null);
    });

    // Event listener for clear search button click
    this.clearSearchTeacher.addEventListener(
      'click',
      this.clearSearchHandler.bind(this),
    );
  }

  /**
   * Displays the list of teacher in the table.
   * @param {Array} teacherData - The list of teacher to be displayed.
   */
  displayTeacherList(teacherData: Person[]): void {
    this.displayPersonList(teacherData, false);
  }

  /**
   * Displays the teacher modal with the provided teacherData.
   * If teacherData is provided, it sets the modal title to 'Edit', otherwise 'Add'.
   * Sets up event listeners for the modal buttons and form inputs.
   * @param {Object} personData - The data of the teacher to be displayed in the modal.
   */
  showTeacherModal(personData: Person): void {
    this.showPersonModal(personData, modelTeacher, true);
  }

  /**
   * Binds the handler for adding new teacher.
   * @param {Function} handler - The handler function for adding teacher.
   */
  bindAddTeacher(handler: (person: Person) => void): void {
    this.bindAddHandler(handler);
  }

  /**
   * Binds the handler for editing existing teacher.
   * @param {Function} handler - The handler function for editing teacher.
   */
  bindEditTeacher(handler: (personId: string, person: Person) => void): void {
    this.bindEditHandler(handler);
  }

  // Bind the handler for getting detail of an teacher
  bindGetDetailTeacher(handler: (personId: number) => void): void {
    this.bindGetDetailHandler(handler);
  }

  // Bind the delete ad handler to the table element
  bindDeleteTeacher(handler: (personId: number) => void): void {
    this.bindDeleteHandler(handler);
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
    this.tableElement.innerHTML = `<p class="search-result-message">${MESSAGES.NO_RESULT}</p>`;
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
    this.tableElement.innerHTML = displayFilterNoResult(PersonType.Teacher);
  }
}
