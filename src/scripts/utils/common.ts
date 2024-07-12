// Import the Teacher interface
import { Teacher } from '@/interfaces';

/**
 * Generates HTML markup for a modal form to manage advertisements.
 * @param item - Object containing advertisement data (optional).
 * @param title - Optional title for the modal (default: 'Add' if no ID is provided, otherwise 'Edit').
 * @returns HTML string for the modal form.
 */
export const generateModalAds = (item: Teacher, title?: string): string => {
  // Destructure properties from the item object with default values
  const {
    id = '',
    name = '',
    subject = '',
    email = '',
    avatar = '',
    className = '',
    gender = '',
  } = item || {};

  // Return the HTML string for the modal form
  return `
    <div class="modal-content">
      <div class="modal-header flex-row justify-between items-center">
        <h2 class="modal-heading">
          ${title || (id ? 'Edit Teacher ' : 'Add Teacher')}
        </h2>
        <button class="btn btn-close-modal" id="close-modal-ads">
          <span>X</span>
        </button>
      </div>
      <div id="ads-form" class="flex-column form-modal">
        <div class="flex-column">
          <p class="form-text">Name</p>
          <input
            id="name"
            class="form-input"
            type="text"
            value="${name}"
          />
          <div id="name-error" class="error-message-form"></div>
        </div>
        <div class="flex-column">
          <p class="form-text">Subject</p>
          <input
            id="subject"
            class="form-input"
            type="text"
            value="${subject}"
          />
          <div id="subject-error" class="error-message-form"></div>
        </div>
        <div class="flex-column">
          <p class="form-text">Email address</p>
          <input
            id="email"
            class="form-input"
            type="email"
            value="${email}"
          />
          <div id="email-error" class="error-message-form"></div>
        </div>
        <div class="flex-column">
          <p class="form-text">Avatar url</p>
          <input
            id="avatar"
            class="form-input"
            type="text"
            value="${avatar}"
          />
          <div id="avatar-error" class="error-message-form"></div>
        </div>
        <div class="flex justify-between form-group">
          <div class="form-select flex-column">
            <select id="class" name="class" class="form-input-select">
              <option value="">Class</option>
              <option value="SS1" ${
                className === 'SS1' ? 'selected' : ''
              }>SS1</option>
              <option value="SS2" ${
                className === 'SS2' ? 'selected' : ''
              }>SS2</option>
              <option value="SS3" ${
                className === 'SS3' ? 'selected' : ''
              }>SS3</option>
              <option value="SS4" ${
                className === 'SS4' ? 'selected' : ''
              }>SS4</option>
              <option value="SS5" ${
                className === 'SS5' ? 'selected' : ''
              }>SS5</option>
            </select>
            <div id="class-error" class="error-message-form"></div>
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
            <div id="gender-error" class="error-message-form"></div>
          </div>
        </div>
        <div class="flex justify-end btn-modal-group">
          <button class="btn btn-submit" id="btn-submit">
            ${id ? 'Save Teacher ' : 'Add Teacher'}
          </button>
          <button id="btn-cancel-modal" class="btn btn-cancel-modal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
};
