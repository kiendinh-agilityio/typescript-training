// Import the AdsData interface
import { Teacher } from '@/interfaces';

// Function to generate the HTML for a single teacher item
export const teacherItem = (item: Teacher): string => {
  // Destructure properties from the item object
  const { id, name, subject, email, className, gender, avatarUrl } = item || {};

  return `
    <div class="flex justify-start items-center table-row" data-id="${id}">
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
        <p class="subject-item">${subject}</p>
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

// Function to generate the HTML for a list of ads
export const generateListTeacher = (items: Teacher[]): string => `
  <div class="table-container">
    <!-- Table header with column titles -->
    <ul class="flex flex-wrap justify-start table-row thead">
      <li>Name</li>
      <li>Subject</li>
      <li>Class</li>
      <li>Email address</li>
      <li>Gender</li>
      <li></li>
    </ul>
    <!-- Table body with items -->
    <div class="flex-column flex-wrap tbody relative">
      <!-- Generate HTML for each ad item and join them into a single string -->
      ${items.map(teacherItem).join('')}
    </div>
  </div>
`;
