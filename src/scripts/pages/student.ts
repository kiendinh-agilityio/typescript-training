// Import constants
import { PERSONS, END_POINTS } from '@/constants';

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
 * Represents the TeacherPage class for handling the business logic and user interactions.
 */
export class StudentPage {
  personServices: PersonServices;
  studentList: StudentList;

  constructor(studentList: StudentList) {
    this.personServices = new PersonServices(END_POINTS.STUDENT);
    this.studentList = studentList;
    this.initialize();
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
}
