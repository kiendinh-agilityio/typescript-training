// Import the constant
import { CLASS_LIST } from '@/constants';

// Import the Teacher interface
import { Teacher } from '@/interfaces';

/**
 * Generates HTML markup for a modal form to manage advertisements.
 * @param item - Object containing advertisement data (optional).
 * @param title - Optional title for the modal (default: 'Add' if no ID is provided, otherwise 'Edit').
 * @returns HTML string for the modal form.
 */
export const generateTeacherModal = (item: Teacher, title?: string): string => {
  // Destructure properties from the item object with default values
  const {
    id = '',
    name = '',
    subject = '',
    email = '',
    avatarUrl = '',
    className = '',
    gender = '',
  } = item || {};

  // Generate class options
  const classOptions = CLASS_LIST.map(
    (cls) => `
    <option value="${cls}" ${
      className === cls ? 'selected' : ''
    }>${cls}</option>
  `,
  ).join('');

  // Return the HTML string for the modal form
  return `
    <div class="modal-content">
      <div class="modal-header flex-row justify-between items-center">
        <h2 class="modal-heading">
          ${title || (id ? 'Edit' : 'Add')} Teacher
        </h2>
        <button class="btn btn-close-modal" id="close-modal-ads">
          <span>X</span>
        </button>
      </div>
      <div id="ads-form" class="flex-column form-modal">
        <div class="flex-column">
          <label class="form-text">Name</label>
          <input
            id="name"
            class="form-input"
            type="text"
            value="${name}"
          />
          <p id="name-error" class="error-message-form"></p>
        </div>
        <div class="flex-column">
          <label class="form-text">Subject</label>
          <input
            id="subject"
            class="form-input"
            type="text"
            value="${subject}"
          />
          <p id="subject-error" class="error-message-form"></p>
        </div>
        <div class="flex-column">
          <label class="form-text">Email address</label>
          <input
            id="email"
            class="form-input"
            type="email"
            value="${email}"
          />
          <p id="email-error" class="error-message-form"></p>
        </div>
        <div class="flex-column">
          <label class="form-text">Avatar url</label>
          <input
            id="avatar"
            class="form-input"
            type="text"
            value="${avatarUrl}"
          />
          <p id="avatar-error" class="error-message-form"></p>
        </div>
        <div class="form-group">
          <div class="form-select flex-column">
            <select id="class" name="class" class="form-input-select">
              <option value="">Class</option>
              ${classOptions}
            </select>
            <p id="class-error" class="error-message-form"></p>
          </div>
          <div class="form-select flex-column">
            <select id="gender" name="gender" class="form-input-select">
              <option value="">Gender</option>
              <option value="Female" ${
                gender === 'Female' ? 'selected' : ''
              }>Female</option>
              <option value="Male" ${
                gender === 'Male' ? 'selected' : ''
              }>Male</option>
            </select>
            <p id="gender-error" class="error-message-form"></p>
          </div>
        </div>
        <div class="flex justify-end btn-modal-group">
          <button class="btn btn-submit" id="btn-submit">
            ${id ? 'Save' : 'Add'} Teacher
          </button>
          <button id="btn-cancel-modal" class="btn btn-cancel-modal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
};
