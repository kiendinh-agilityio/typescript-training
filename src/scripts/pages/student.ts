// Import constants
import {
  PERSONS,
  END_POINTS,
  ICONS,
  MESSAGES,
  TIMES,
  SPECIAL_KEYS,
  REGEX,
} from '@/constants';

// Define the structure of advertisement data
import { Person } from '@/types';

// Import utils
import {
  createDelayAction,
  createSearchDebounce,
  displayToastMessage,
  displayTabletNoData,
  startLoadingSpinner,
  stopLoadingSpinner,
} from '@/utils';

// Import class StudentList
import { StudentList } from '@/events';

// Import class PersonServices
import { PersonServices } from '@/services';

/**
 * Represents the StudentPage class for handling the business logic and user interactions.
 */
export class StudentPage {
  personServices: PersonServices;
  studentListEvent: StudentList;
  handleSearchDebounced: () => void;

  constructor(studentListEvent: StudentList) {
    this.personServices = new PersonServices(END_POINTS.STUDENT);
    this.studentListEvent = studentListEvent;
    this.initialize();

    // Bind add handler
    this.studentListEvent.bindAddStudent(this.handleAddStudent.bind(this));

    // Bind edit handler
    this.studentListEvent.bindEditStudent(this.handleEditStudent.bind(this));

    // Get detail student
    this.studentListEvent.bindGetDetailStudent(
      this.handleGetDetailStudent.bind(this),
    );

    // Add event delete
    this.studentListEvent.bindDeleteStudent(this.handleDeleteStudent.bind(this));

    // Add event listeners for search and clear search buttons
    this.studentListEvent.btnSearchStudent.addEventListener(
      'click',
      this.handleSearchStudent.bind(this),
    );

    this.studentListEvent.clearSearchStudent.addEventListener(
      'click',
      this.handleClearSearch.bind(this),
    );

    // Initialize debounced search handling
    this.handleSearchDebounced = createSearchDebounce(
      this.handleSearchStudent.bind(this),
      TIMES.DEBOUNCE,
    );

    // Add event listeners for real-time search
    this.studentListEvent.inputSearchStudent.addEventListener('input', () => {
      this.handleSearchDebounced();
    });

    // Add event listener for pressing Enter key in the search input
    this.studentListEvent.inputSearchStudent.addEventListener(
      'keypress',
      (event: KeyboardEvent) => {
        if (event.key === SPECIAL_KEYS.ENTER) {
          this.handleSearchStudent();
        }
      },
    );

    // Add event for filter class
    this.studentListEvent.studentFilterClass.addEventListener(
      'change',
      this.filterClassStudent.bind(this),
    );
  }

  /**
   * Initializes and fetches the initial data.
   */
  async initialize(): Promise<void> {
    // Start the loading spinner to indicate data fetching
    startLoadingSpinner();

    // Fetch person data from the service
    const data = await this.personServices.fetchPersonData();

    // Check if data is available and has items
    data && data.length > 0
      ? this.studentListEvent.displayStudentList(data)
      : displayTabletNoData(PERSONS.STUDENTS);

    // Directly stop loading spinner after response is received
    stopLoadingSpinner();
  }

  /**
   * Handles the asynchronous addition of new student.
   * @param {object} newPerson - The data of the new student to be added.
   */
  async handleAddStudent(newPerson: Person): Promise<void> {
    // Send a request to add the new person and await the response
    const response = await this.personServices.addPerson(newPerson);

    // Check if the response is an array, then push the items into personData
    this.personServices.personData.push(response);

    // Display the list of student after adding
    this.studentListEvent.displayStudentList(this.personServices.personData);
  }

  /**
   * Handles the asynchronous editing of existing student.
   * @param {number} personId - The ID of the ad to be edited.
   * @param {object} updatedPerson - The updated data of the student.
   */
  async handleEditStudent(
    personId: string,
    updatedPerson: Person,
  ): Promise<void> {
    // Edit the ad in the model
    const response = await this.personServices.editPerson(
      personId,
      updatedPerson,
    );

    // Find the edited ad in the personData array
    const editedStudent = this.personServices.personData.find(
      (person) => person.id === personId,
    );

    // Update the edited student with the response data
    editedStudent && Object.assign(editedStudent, response);

    // Display the list of student after edit
    this.studentListEvent.displayStudentList(this.personServices.personData);
  }

  /**
   * Asynchronously handles the retrieval of detailed information for a specific student.
   * @param {string} personId - The unique identifier of the student.
   */
  async handleGetDetailStudent(personId: string): Promise<void> {
    const response = await this.personServices.getPersonDetail(personId);

    // Display the student modal with the retrieved details from the model.
    this.studentListEvent.showStudentModal(response);

    // Display detail information for students
    this.studentListEvent.handleDetailStudent(personId);
  }

  /**
   * Handles the student deletion.
   * @param {number} personId - The ID of the student to be deleted.
   */
  async handleDeleteStudent(personId: number): Promise<void> {
    createDelayAction(async () => {
      const response = await this.personServices.deletePerson(personId);

      // Get the updated list of people from personServices after deletion
      const studentList = this.personServices.personData;

      // Filter out the deleted ad from the personData list
      const updatedStudentData = studentList.filter(
        (person) => Number(person.id) !== personId,
      );

      // Update the personData in personServices with the filtered list
      this.personServices.personData = updatedStudentData;

      // Display the updated list of person and show tablet when no data
      updatedStudentData && updatedStudentData.length > 0
        ? this.studentListEvent.displayStudentList(updatedStudentData)
        : displayTabletNoData(PERSONS.STUDENTS);

      // If the response is defined, stop the loading spinner to indicate that the operation is complete.
      response && stopLoadingSpinner();

      // Show a success notification
      displayToastMessage(MESSAGES.DELETE_SUCCESS, ICONS.SUCCESS);
    });
  }

  /**
   * Handles the search student action.
   */
  async handleSearchStudent(): Promise<void> {
    const keyword: string = this.studentListEvent.inputSearchStudent.value
      .trim()
      .toLowerCase();

    // Check if a keyword is present and if person data needs to be loaded
    if (
      keyword &&
      (!this.personServices.personData.length || this.personServices.error)
    ) {
      await this.personServices.fetchPersonData();
    }

    // Remove spaces in the keyword
    const formattedKeyword: string = keyword.replace(REGEX.KEYWORD, '');

    // Filter the personData based on the entered keyword in the search input.
    const filteredPerson = this.personServices.personData.filter((person) => {
      const { name = '', email = '' } = person || {};

      // Remove spaces and convert to lowercase
      const formattedName: string = name
        ? name.replace(REGEX.KEYWORD, '').toLowerCase()
        : '';

      return (
        formattedName.includes(formattedKeyword) ||
        email.includes(formattedKeyword)
      );
    });

    // Display matching ads if results are found
    if (filteredPerson.length) {
      this.studentListEvent.displayStudentList(filteredPerson);
    } else {
      this.studentListEvent.handleSearchNoResult();
    }

    // Stop loading spinner
    stopLoadingSpinner();
  }

  // Handles clearing the search input and displaying the initial data
  handleClearSearch(): void {
    this.initialize();
  }

  /**
   * Handles changes to the class filter selection.
   * @returns A promise that resolves when the filtering and display update are complete.
   */
  async filterClassStudent(): Promise<void> {
    // start the loading spinner
    startLoadingSpinner();

    const selectedClassStudent = (
      this.studentListEvent.studentFilterClass as HTMLSelectElement
    ).value;

    try {
      // Fetch the filtered list of students based on the selected class
      const filterClassStudents =
        await this.personServices.filterPersonByClass(selectedClassStudent);

      // Update the display with the filtered list of students
      this.studentListEvent.displayStudentList(filterClassStudents);
    } catch (error) {
      this.studentListEvent.handleFilterNoResult();
    }

    // Stop the loading spinner
    stopLoadingSpinner();
  }
}
