// Import constants
import {
  MESSAGES,
  ICONS,
  TIMES,
  SPECIAL_KEYS,
  REGEX,
  PERSONS,
} from '@/constants';

// Define the structure of advertisement data
import { Person } from '@/interfaces';

// Import utils
import {
  delayAction,
  showToast,
  stopLoadingSpinner,
  debounce,
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
  handleSearchDebounced: () => void;

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

    // Add event listeners for search and clear search buttons
    this.teacherList.btnSearchTeacher.addEventListener(
      'click',
      this.handleSearch.bind(this),
    );
    this.teacherList.clearSearchTeacher.addEventListener(
      'click',
      this.handleClearSearch.bind(this),
    );

    // Initialize debounced search handling
    this.handleSearchDebounced = debounce(
      this.handleSearch.bind(this),
      TIMES.DEBOUNCE,
    );

    // Add event listeners for real-time search
    this.teacherList.inputSearchTeacher.addEventListener('input', () => {
      this.handleSearchDebounced();
    });

    // Add event listener for pressing Enter key in the search input
    this.teacherList.inputSearchTeacher.addEventListener(
      'keypress',
      (event: KeyboardEvent) => {
        if (event.key === SPECIAL_KEYS.ENTER) {
          this.handleSearch();
        }
      },
    );
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
  async handleDeleteTeacher(personId: number): Promise<void> {
    delayAction(async () => {
      const response = await this.personServices.deletePerson(personId);

      // Get the updated list of people from personServices after deletion
      const teacherList = this.personServices.personData;

      // Filter out the deleted ad from the personData list
      const updatedTeacherData = teacherList.filter(
        (person) => Number(person.id) !== personId,
      );

      // Update the personData in personServices with the filtered list
      this.personServices.personData = updatedTeacherData;

      // Display the updated list of person and show tablet when no data
      updatedTeacherData && updatedTeacherData.length > 0
        ? this.teacherList.displayTeacherList(updatedTeacherData)
        : showTabletNoData(PERSONS.TEACHERS);

      // If the response is defined, stop the loading spinner to indicate that the operation is complete.
      response && stopLoadingSpinner();

      // Show a success notification
      showToast(MESSAGES.DELETE_SUCCESS, ICONS.SUCCESS, true);
    });
  }

  /**
   * Handles the search action.
   */
  async handleSearch(): Promise<void> {
    const keyword: string = this.teacherList.inputSearchTeacher.value
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
      this.teacherList.displayTeacherList(filteredPerson);
    } else {
      this.teacherList.handleSearchNoResult();
    }
  }

  // Handles clearing the search input and displaying the initial data
  handleClearSearch(): void {
    this.initialize();
  }
}
