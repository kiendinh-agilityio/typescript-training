// Import teacher list
import { generateListPerson } from '@/templates';

// Import interfaces Person data
import { Person } from '@/interfaces';

// Definition StudentList class
export class StudentList {
  tableStudent: HTMLElement;

  constructor() {
    this.initElementsStudent();
  }

  /**
   * Initializes the DOM elements.
   */
  initElementsStudent(): void {
    this.tableStudent = document.getElementById('list-student');
  }

  /**
   * Displays the list of student in the table.
   * @param {Array} studentData - The list of student to be displayed.
   */
  displayStudentList(studentData: Person[]): void {
    // Newly added student will appear at the top
    const reversedStudentData = studentData.slice().reverse();

    // Generate the HTML for the reversed list of student
    const studentListHTML = generateListPerson(reversedStudentData, true);

    // Update the table element's inner HTML with the new student list
    this.tableStudent.innerHTML = studentListHTML;
  }
}
