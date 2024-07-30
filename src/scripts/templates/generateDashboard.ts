// Import the Person interface
import { Person } from '@/interfaces';

// Function to generate the HTML for a single item (Teacher or Student)
export const personItem = (
  item: Person,
  isStudentPage: boolean,
  isSelected?: boolean,
): string => {
  // Destructure properties from the item object
  const { id, name, subject, email, className, gender, avatarUrl } = item || {};

  return `
    <div class="flex justify-start items-center table-row student-table ${
      isSelected ? 'highlighted' : ''
    }" data-id="${id}">
      <div class="flex items-center dasboard-item">
        <img
          loading="lazy"
          width="24px"
          height="24px"
          class="avatar-item"
          src="${avatarUrl}"
          alt="Avatar"
        />
        <p class="name-item">${name}</p>
      </div>
      <div class="table-cell dasboard-item">
        <p class="${isStudentPage ? 'student-id-item' : 'subject-item'}">${
          isStudentPage ? id : subject
        }</p>
      </div>
      <div class="table-cell dasboard-item">
        <p class="class-item">${className}</p>
      </div>
      <div class="table-cell dasboard-item">
        <a href="mailto:${email}" class="email-item">${email}</a>
      </div>
      <div class="table-cell dasboard-item">
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
      <li>Name</li>
      <li>${isStudentPage ? 'Student ID' : 'Subject'}</li>
      <li>Class</li>
      <li>Email address</li>
      <li>Gender</li>
      <li></li>
    </ul>
    <!-- Table body with items -->
    <div class="flex-column flex-wrap tbody relative">
      <!-- Generate HTML for each item and join them into a single string -->
      ${items.map((item) => personItem(item, isStudentPage)).join('')}
    </div>
  </div>
`;

// Function to generate the HTML for display detail information student
export const generateDetailStudent = (item: Person): string => {
  // Destructure properties from the item object
  const { id, name, email, className, gender, avatarUrl } = item || {};

  return `
    <div class="flex-column detail-infor-content" data-id="${id}">
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
        <p>People from the same class</p>
      </div>
    </div>
  `;
};
