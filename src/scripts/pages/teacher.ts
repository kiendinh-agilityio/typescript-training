// Import constants
import { MESSAGES, ICONS } from '@/constants';

// Define the structure of advertisement data
import { Person } from '@/interfaces';

// Import utils
import { delayAction, showToast, stopLoadingSpinner } from '@/utils';

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

    // Bind add handler to the view
    this.teacherList.bindAddTeacher(this.handleAddTeacher.bind(this));
  }

  /**
   * Initializes and fetches the initial data.
   */
  async initialize(): Promise<void> {
    const data = await this.personServices.fetchPersonData();

    if (data) {
      this.teacherList.displayTeacherList(data);
    }
  }

  /**
   * Handles the asynchronous addition of new teacher.
   * @param {object} newTeacher - The data of the new teacher to be added.
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

      // Return to the initial state
      await this.initialize();

      // Directly stop loading spinner after response is received
      stopLoadingSpinner();

      // Show success toast message
      showToast(MESSAGES.ADD_SUCCESS, ICONS.SUCCESS, true);
    });
  }

  // Show the teacher modal with the given teacherData
  handleShowTeacherModal(teacherData: Person): void {
    this.teacherList.showTeacherModal(teacherData);
  }
}
