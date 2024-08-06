// Import the Person interface
import { Person } from '@/interfaces';

// Import constants
import { CLASSES } from '@/constants';

// Returns the background color class for table rows based on the index.
const getRowColorClass = (index: number): string =>
  index % 2 === 0 ? CLASSES.BG_LIGHT : CLASSES.BG_HIGH_LIGHT;

// Function to generate the HTML for a single item (Teacher or Student)
export const personItem = (
  item: Person,
  isStudentPage: boolean,
  index: number,
  isSelected?: boolean,
): string => {
  // Destructure properties from the item object
  const { id, name, subject, email, className, gender, avatarUrl } = item || {};

  // Get the row color class
  const rowColorClass = getRowColorClass(index);

  return `
    <div class="flex items-center table-row student-table ${rowColorClass} ${
      isSelected ? 'highlighted' : ''
    }" data-id="${id}">
      <div class="flex items-center dashboard-item">
        <img
          loading="lazy"
          width="32px"
          height="32px"
          class="avatar-item"
          src="${avatarUrl}"
          alt="Avatar"
        />
        <p class="name-item">${name}</p>
      </div>
      <div class="table-cell dashboard-item">
        <p class="${isStudentPage ? 'student-id-item' : 'subject-item'}">${
          isStudentPage ? id : subject
        }</p>
      </div>
      <div class="table-cell dashboard-item">
        <p class="class-item">${className}</p>
      </div>
      <div class="table-cell dashboard-item">
        <a href="mailto:${email}" class="email-item">${email}</a>
      </div>
      <div class="flex justify-center table-cell dashboard-item">
        <p class="gender-item">${gender}</p>
      </div>
      <div class="table-cell dropdown-group">
        <div class="dropdown">
          <button class="btn btn-dropdown" data-id="${id}">
            <img
              width="14px"
              height="3px"
              src="/images/svg/more.svg"
              alt="Button group"
              data-id="${id}"
            />
          </button>
          <div class="dropdown-content" data-id="${id}">
            <button data-id="${id}">
              <img
                width="20px"
                height="20px"
                src="/images/svg/edit.svg"
                alt="Button Edit"
              />
            </button>
            <button data-id="${id}">
              <img
                width="20px"
                height="20px"
                src="/images/svg/delete.svg"
                alt="Button Delete"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Function to generate the HTML for a list of teachers or students
export const generateListPerson = (
  items: Person[],
  isStudentPage: boolean,
): string => `
  <div class="table-container">
    <!-- Table header with column titles -->
    <ul class="flex flex-wrap justify-start table-row thead student-table">
      <li><span>Name</span></li>
      <li>${isStudentPage ? 'Student ID' : 'Subject'}</li>
      <li>Class</li>
      <li>Email address</li>
      <li class="flex justify-center">Gender</li>
      <li></li>
    </ul>
    <!-- Table body with items -->
    <div class="flex-column flex-wrap tbody relative">
      <!-- Generate HTML for each item and join them into a single string -->
      ${items
        .map((item, index) => personItem(item, isStudentPage, index))
        .join('')}
    </div>
  </div>
`;

// Function to generate the HTML for display detail information student
export const generateDetailStudent = (
  item: Person,
  studentSameClass: Person[],
): string => {
  // Destructure properties from the item object
  const { id, name, email, className, gender, avatarUrl } = item || {};

  return `
    <div class="flex-column detail-info-content" data-id="${id}">
      <div class="flex-column items-center">
        <p class="detail-id">${id}</p>
        <img
          loading="lazy"
          width="90px"
          height="90px"
          class="detail-avatar"
          src="${avatarUrl}"
          alt="Avatar"
        />
        <p class="detail-name">${name}</p>
        <div class="flex detail-contact">
          <a href="#" class="flex items-center justify-center detail-contact-item">
            <img
              width="24px"
              height="24px"
              src="/images/svg/teacher.svg"
              alt="Teacher icon"
            />
          </a>
          <a href="#" class="flex items-center justify-center detail-contact-item">
            <img
              width="24px"
              height="24px"
              src="/images/svg/phone.svg"
              alt="Phone icon"
            />
          </a>
          <a href="#" class="flex items-center justify-center detail-contact-item">
            <img
              width="24px"
              height="24px"
              src="/images/svg/sms.svg"
              alt="Sms icon"
            />
          </a>
        </div>
      </div>
      <div class="detail-group">
        <p class="detail-label">Email address</p>
        <a href="mailto:${email}" class="detail-item">${email}</a>
      </div>
      <div class="flex justify-between">
        <div>
          <p class="detail-label">Class</p>
          <p class="detail-item">${className}</p>
        </div>
        <div>
          <p class="detail-label">Gender</p>
          <p class="detail-item">${gender}</p>
        </div>
      </div>
      <div>
        <p class="detail-same-class">People from the same class</p>
        ${displayStudentSameClass(studentSameClass)}
      </div>
    </div>
  `;
};

// Generate HTML for student from the same class
const displayStudentSameClass = (studentSameClass: Person[]): string => {
  if (studentSameClass.length === 0) return '';

  // Display up to 3 student
  const displayAvatarStudent = studentSameClass.slice(0, 3);
  const remainingCount = studentSameClass.length - displayAvatarStudent.length;

  // Create HTML for displayed student
  const avatarStudent = displayAvatarStudent
    .map(
      (person) => `
    <div>
      <img
        loading="lazy"
        width="38px"
        height="38px"
        class="avatar-item"
        src="${person.avatarUrl}"
        alt="Avatar"
      />
    </div>
  `,
    )
    .join('');

  // Add "+X more" if there are additional student
  const moreInfo =
    (remainingCount > 0 &&
      `<p class="detail-more">+${remainingCount} more</p>`) ||
    '';

  return `
    <div class="flex items-center">
      ${avatarStudent}
      ${moreInfo}
    </div>
  `;
};
