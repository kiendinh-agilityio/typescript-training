// Import constants
import { PERSONS, END_POINTS } from '@/constants';

// Define the structure of advertisement data
import { Person } from '@/interfaces';

// Import utils
import {
  showTabletNoData,
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
  studentList: StudentList;

  constructor(studentList: StudentList) {
    this.personServices = new PersonServices(END_POINTS.STUDENT);
    this.studentList = studentList;
    this.initialize();

    // Bind add handler
    this.studentList.bindAddStudent(this.handleAddStudent.bind(this));
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
      ? this.studentList.displayStudentList(data)
      : showTabletNoData(PERSONS.STUDENTS);

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
    this.studentList.displayStudentList(this.personServices.personData);
  }
}