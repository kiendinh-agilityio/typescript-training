// Import constants
import { MESSAGES, ICONS, PERSONS } from '@/constants';

// Define the structure of advertisement data
import { Person } from '@/interfaces';

// Import utils
import {
  delayAction,
  showToast,
  stopLoadingSpinner,
  showTabletNoData,
} from '@/utils';

// Import class TeacherList
import { TeacherList } from '@/events';

// Import class PersonServices
import { PersonServices } from '@/services';

/**
 * Represents the TeacherPage class for handling the business logic and user interactions.
 */
export class TeacherPage {
  personServices: PersonServices;
  teacherList: TeacherList;

  constructor(personServices: PersonServices, teacherList: TeacherList) {
    this.personServices = personServices;
    this.teacherList = teacherList;
    this.initialize();

    // Bind add handler
    this.teacherList.bindAddTeacher(this.handleAddTeacher.bind(this));

    // Bind edit handler
    this.teacherList.bindEditTeacher(this.handleEditTeacher.bind(this));

    // Add event edit
    this.teacherList.bindGetDetailTeacher(
      this.handleGetDetailTeacher.bind(this),
    );

    // Add event delete
    this.teacherList.bindDeleteTeacher(this.handleDeleteTeacher.bind(this));
  }

  /**
   * Initializes and fetches the initial data.
   */
  async initialize(): Promise<void> {
    const data = await this.personServices.fetchPersonData();

    data && data.length > 0
      ? this.teacherList.displayTeacherList(data)
      : showTabletNoData(PERSONS.TEACHERS);
  }

  /**
   * Handles the asynchronous addition of new teacher.
   * @param {object} newPerson - The data of the new teacher to be added.
   */
  async handleAddTeacher(newPerson: Person): Promise<void> {
    // Introduce a delay before adding the new teacher
    delayAction(async () => {
      // Send a request to add the new person and await the response
      const response = await this.personServices.addPerson(newPerson);

      // Check if the response is an array, then push the items into personData
      this.personServices.personData.push(response);

      // Refresh teacherData after adding
      await this.personServices.fetchPersonData();

      // Display the list of teacher after adding
      this.teacherList.displayTeacherList(this.personServices.personData);

      // Directly stop loading spinner after response is received
      stopLoadingSpinner();

      // Show success toast message
      showToast(MESSAGES.ADD_SUCCESS, ICONS.SUCCESS, true);
    });
  }

  // Show the teacher modal with the given teacherData
  handleShowTeacherModal(personData: Person): void {
    this.teacherList.showTeacherModal(personData);
  }

  /**
   * Handles the asynchronous editing of existing teacher.
   * @param {number} personId - The ID of the ad to be edited.
   * @param {object} updatedPerson - The updated data of the teacher.
   */
  async handleEditTeacher(
    personId: string,
    updatedPerson: Person,
  ): Promise<void> {
    delayAction(async () => {
      // Edit the ad in the model
      const response = await this.personServices.editPerson(
        personId,
        updatedPerson,
      );

      // Find the edited ad in the personData array
      const editedTeacher = this.personServices.personData.find(
        (person) => person.id === personId,
      );

      // Update the edited teacher with the response data
      editedTeacher && Object.assign(editedTeacher, response);

      // Display the list of teacher after edit
      this.teacherList.displayTeacherList(this.personServices.personData);

      // Directly stop loading spinner after response is received
      stopLoadingSpinner();

      // Show a success notification
      showToast(MESSAGES.EDIT_SUCCESS, ICONS.SUCCESS, true);
    });
  }

  /**
   * Asynchronously handles the retrieval of detailed information for a specific teacher.
   * @param {string} personId - The unique identifier of the teacher.
   */
  async handleGetDetailTeacher(personId: string): Promise<void> {
    const response = await this.personServices.getPersonDetail(personId);

    // Display the teacher modal with the retrieved details from the model.
    this.teacherList.showTeacherModal(response);
  }

  /**
   * Handles the teacher deletion.
   * @param {number} personId - The ID of the teacher to be deleted.
   */
  async handleDeleteTeacher(personId: string): Promise<void> {
    delayAction(async () => {
      const response = await this.personServices.deletePerson(personId);

      // Filter out the deleted ad from the personData list
      const updatedTeacherData = this.personServices.personData.filter(
        (person) => person.id !== personId,
      );

      // Display the updated list of person
      this.teacherList.displayTeacherList(updatedTeacherData);

      // Return to the initial state
      await this.initialize();

      if (response) {
        stopLoadingSpinner();
      }

      // Show a success notification
      showToast(MESSAGES.DELETE_SUCCESS, ICONS.SUCCESS, true);
    });
  }
}
