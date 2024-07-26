// Import constants
import { PERSONS, END_POINTS, ICONS, MESSAGES } from '@/constants';

// Define the structure of advertisement data
import { Person } from '@/interfaces';

// Import utils
import {
  showTabletNoData,
  startLoadingSpinner,
  stopLoadingSpinner,
  delayAction,
  showToast,
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

    // Bind edit handler
    this.studentList.bindEditStudent(this.handleEditStudent.bind(this));

    // Get detail student
    this.studentList.bindGetDetailStudent(
      this.handleGetDetailStudent.bind(this),
    );

    // Add event delete
    this.studentList.bindDeleteStudent(this.handleDeleteStudent.bind(this));
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
    this.studentList.displayStudentList(this.personServices.personData);
  }

  /**
   * Asynchronously handles the retrieval of detailed information for a specific student.
   * @param {string} personId - The unique identifier of the student.
   */
  async handleGetDetailStudent(personId: string): Promise<void> {
    const response = await this.personServices.getPersonDetail(personId);

    // Display the student modal with the retrieved details from the model.
    this.studentList.showStudentModal(response);
  }

  /**
   * Handles the student deletion.
   * @param {number} personId - The ID of the student to be deleted.
   */
  async handleDeleteStudent(personId: number): Promise<void> {
    delayAction(async () => {
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
        ? this.studentList.displayStudentList(updatedStudentData)
        : showTabletNoData(PERSONS.STUDENTS);

      // If the response is defined, stop the loading spinner to indicate that the operation is complete.
      response && stopLoadingSpinner();

      // Show a success notification
      showToast(MESSAGES.DELETE_SUCCESS, ICONS.SUCCESS, true);
    });
  }
}
