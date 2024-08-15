// Import constants
import {
  MESSAGES,
  ICONS,
  TIMES,
  SPECIAL_KEYS,
  REGEX,
  PERSONS,
  END_POINTS,
} from '@/constants';

// Define the structure of advertisement data
import { Person } from '@/types';

// Import utils
import {
  createDelayAction,
  createSearchDebounce,
  displayToastMessage,
  displayTabletNoData,
  stopLoadingSpinner,
  startLoadingSpinner,
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
  teacherListEvent: TeacherList;
  handleSearchDebounced: () => void;

  constructor(teacherListEvent: TeacherList) {
    this.personServices = new PersonServices(END_POINTS.TEACHER);
    this.teacherListEvent = teacherListEvent;
    this.initialize();

    // Bind add handler
    this.teacherListEvent.bindAddTeacher(this.handleAddTeacher.bind(this));

    // Bind edit handler
    this.teacherListEvent.bindEditTeacher(this.handleEditTeacher.bind(this));

    // Add event edit
    this.teacherListEvent.bindGetDetailTeacher(
      this.handleGetDetailTeacher.bind(this),
    );

    // Add event delete
    this.teacherListEvent.bindDeleteTeacher(this.handleDeleteTeacher.bind(this));

    // Add event listeners for search and clear search buttons
    this.teacherListEvent.btnSearchTeacher.addEventListener(
      'click',
      this.handleSearch.bind(this),
    );
    this.teacherListEvent.clearSearchTeacher.addEventListener(
      'click',
      this.handleClearSearch.bind(this),
    );

    // Initialize debounced search handling
    this.handleSearchDebounced = createSearchDebounce(
      this.handleSearch.bind(this),
      TIMES.DEBOUNCE,
    );

    // Add event listeners for real-time search
    this.teacherListEvent.inputSearchTeacher.addEventListener('input', () => {
      this.handleSearchDebounced();
    });

    // Add event listener for pressing Enter key in the search input
    this.teacherListEvent.inputSearchTeacher.addEventListener(
      'keypress',
      (event: KeyboardEvent) => {
        if (event.key === SPECIAL_KEYS.ENTER) {
          this.handleSearch();
        }
      },
    );

    // Add event for filter class
    this.teacherListEvent.teacherFilterClass.addEventListener(
      'change',
      this.filterClassTeacher.bind(this),
    );
  }

  /**
   * Initializes and fetches the initial data.
   */
  async initialize(): Promise<void> {
    // Start the loading spinner to indicate data fetching
    startLoadingSpinner();

    const data = await this.personServices.fetchPersonData();

    data && data.length > 0
      ? this.teacherListEvent.displayTeacherList(data)
      : displayTabletNoData(PERSONS.TEACHERS);

    // Directly stop loading spinner after response is received
    stopLoadingSpinner();
  }

  /**
   * Handles the asynchronous addition of new teacher.
   * @param {object} newPerson - The data of the new teacher to be added.
   */
  async handleAddTeacher(newPerson: Person): Promise<void> {
    // Send a request to add the new person and await the response
    const response = await this.personServices.addPerson(newPerson);

    // Check if the response is an array, then push the items into personData
    this.personServices.personData.push(response);

    // Display the list of teacher after adding
    this.teacherListEvent.displayTeacherList(this.personServices.personData);
  }

  // Show the teacher modal with the given teacherData
  handleShowTeacherModal(personData: Person): void {
    this.teacherListEvent.showTeacherModal(personData);
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
    this.teacherListEvent.displayTeacherList(this.personServices.personData);
  }

  /**
   * Asynchronously handles the retrieval of detailed information for a specific teacher.
   * @param {string} personId - The unique identifier of the teacher.
   */
  async handleGetDetailTeacher(personId: string): Promise<void> {
    const response = await this.personServices.getPersonDetail(personId);

    // Display the teacher modal with the retrieved details from the model.
    this.teacherListEvent.showTeacherModal(response);
  }

  /**
   * Handles the teacher deletion.
   * @param {number} personId - The ID of the teacher to be deleted.
   */
  async handleDeleteTeacher(personId: number): Promise<void> {
    createDelayAction(async () => {
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
        ? this.teacherListEvent.displayTeacherList(updatedTeacherData)
        : displayTabletNoData(PERSONS.TEACHERS);

      // If the response is defined, stop the loading spinner to indicate that the operation is complete.
      response && stopLoadingSpinner();

      // Show a success notification
      displayToastMessage(MESSAGES.DELETE_SUCCESS, ICONS.SUCCESS);
    });
  }

  /**
   * Handles the search action.
   */
  async handleSearch(): Promise<void> {
    const keyword: string = this.teacherListEvent.inputSearchTeacher.value
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
      this.teacherListEvent.displayTeacherList(filteredPerson);
    } else {
      this.teacherListEvent.handleSearchNoResult();
    }

    // Stop the loading spinner
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
  async filterClassTeacher(): Promise<void> {
    // start the loading spinner
    startLoadingSpinner();

    const selectedClassTeacher = (
      this.teacherListEvent.teacherFilterClass as HTMLSelectElement
    ).value;

    try {
      // Fetch the filtered list of teacher based on the selected class
      const filterClassTeacher =
        await this.personServices.filterPersonByClass(selectedClassTeacher);

      // Update the display with the filtered list of teacher
      this.teacherListEvent.displayTeacherList(filterClassTeacher);
    } catch (error) {
      this.teacherListEvent.handleFilterNoResult();
    }

    // Stop the loading spinner
    stopLoadingSpinner();
  }
}
