// Import student list
import { generateDetailStudent } from '@/templates';

// Import interfaces Person data
import { Person, PersonType } from '@/types';

// Import constants
import { DISPLAY_CLASSES, MESSAGES, END_POINTS, TIMES } from '@/constants';

// Import utils
import {
  createFilterClass,
  displayFilterNoResult,
  modelStudent,
  searchStudent,
  startLoadingSpinner,
} from '@/utils';

// Import class PersonServices
import { PersonServices } from '@/services';

// Import class PersonList
import { PersonList } from '@/events';

// Definition StudentList class
export class StudentList extends PersonList {
  btnAddStudent: HTMLElement;
  btnSearchStudent: HTMLElement;
  inputSearchStudent: HTMLInputElement;
  clearSearchStudent: HTMLElement;
  studentFilterClass: HTMLElement;
  detailContainer: HTMLElement;
  selectedStudentId: string;

  constructor() {
    super('modal-confirm-student');
    this.initTableElement('list-student');
    this.initElementsStudent();
    this.initEventListenersStudent();
    this.initEventListenersPerson();
    this.initializeSearchInput();
    this.selectFilterStudent();
    this.selectedStudentId = '';
  }

  /**
   * Initializes the DOM elements.
   */
  initElementsStudent(): void {
    this.btnAddStudent = document.getElementById('btn-add-student');
    this.btnSearchStudent = searchStudent.querySelector('#btn-search-student');
    this.inputSearchStudent = searchStudent.querySelector(
      '#input-search-student',
    );
    this.detailContainer = document.getElementById('detail-info-student');
  }

  // Initialize event listeners
  initEventListenersStudent(): void {
    this.clearSearchStudent = searchStudent.querySelector(
      '#clear-search-student',
    );

    // Event listener for button add click
    this.btnAddStudent.addEventListener('click', () => {
      this.showStudentModal(null);
    });

    // Event listener for table element click
    this.tableElement.addEventListener('click', async (event: MouseEvent) => {
      const showDetailInfo = (event.target as HTMLElement)
        ?.closest('[data-id]')
        ?.getAttribute('data-id');

      // Handle show detail info student when click
      showDetailInfo &&
        ((this.selectedStudentId = showDetailInfo),
        this.handleDetailStudent(showDetailInfo),
        this.highlightSelectedRow());
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

    this.displayPersonList(studentData, true);

    // Automatically select and display the first student detail if available
    if (reversedStudentData.length > 0) {
      const firstStudentId = reversedStudentData[0].id;
      this.selectedStudentId = firstStudentId.toString();

      this.handleDetailStudent(this.selectedStudentId);
      this.highlightSelectedRow();
    }
  }

  /**
   * Displays the student modal with the provided studentData.
   * If studentData is provided, it sets the modal title to 'Edit', otherwise 'Add'.
   * Sets up event listeners for the modal buttons and form inputs.
   * @param {Object} personData - The data of the student to be displayed in the modal.
   */
  showStudentModal(personData: Person): void {
    this.showPersonModal(personData, modelStudent, false);
  }

  /**
   * Binds the handler for adding new student.
   * @param {Function} handler - The handler function for adding student.
   */
  bindAddStudent(handler: (person: Person) => void): void {
    this.bindAddHandler(handler);
  }

  /**
   * Binds the handler for editing existing student.
   * @param {Function} handler - The handler function for editing student.
   */
  bindEditStudent(handler: (personId: string, person: Person) => void): void {
    this.bindEditHandler(handler);
  }

  // Bind the handler for getting detail of an student
  bindGetDetailStudent(handler: (personId: number) => void): void {
    this.bindGetDetailHandler(handler);
  }

  // Bind the delete ad handler to the table element
  bindDeleteStudent(handler: (personId: number) => void): void {
    this.bindDeleteHandler(handler);
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
    this.tableElement.innerHTML = `<p class="search-result-message">${MESSAGES.NO_RESULT}</p>`;
    this.detailContainer.innerHTML = '';
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
    this.tableElement.innerHTML = displayFilterNoResult(PersonType.Student);
    this.detailContainer.innerHTML = '';
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

    // Ensure that `studentSameClass` is defined and available in your context.
    const studentSameClass = await personServices.filterPersonByClass(
      studentDetail.className,
    );

    const detailHTML = generateDetailStudent(studentDetail, studentSameClass);

    // Update the detail container with the generated HTML
    this.detailContainer.innerHTML = detailHTML;
  }

  /**
   * Highlights the selected row by adding a CSS class.
   */
  highlightSelectedRow(): void {
    const tabletStudent = this.tableElement.querySelectorAll('.table-row');
    tabletStudent.forEach((row) => {
      row.classList.remove('highlighted');
    });

    const selectedRow = this.tableElement.querySelector(
      `[data-id="${this.selectedStudentId}"]`,
    );

    selectedRow && selectedRow.classList.add('highlighted');
  }
}
