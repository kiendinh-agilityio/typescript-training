// Import the AdsData interface
import { AdsData } from '@/interfaces';

// Function to generate the HTML for a modal form for adding or editing ads
export const generateModalAds = (item: AdsData, title?: string): string => {
  // Destructure properties from the item object with default values
  const {
    id = '',
    network = '',
    link = '',
    email = '',
    phone = '',
    status = '',
  } = item || {};

  // Return the HTML string for the modal form
  return `
    <div class="modal-content">
      <div class="modal-header flex-row justify-between items-center">
        <h2 class="modal-heading">${title || (id ? 'Edit Ads ' : 'Add Ads')}</h2>
        <button class="btn btn-close-modal" id="close-modal-ads">
          <span>X</span>
        </button>
      </div>
      <div id="ads-form" class="flex-column form-modal">
        <div class="flex-column">
          <input
            id="network"
            class="form-input"
            type="text"
            placeholder="Network"
            value="${network}"
          />
          <div id="network-error" class="error-message-form"></div>
        </div>
        <div class="flex-column">
          <input
            id="link"
            class="form-input"
            type="text"
            placeholder="www.example.com"
            value="${link}"
          />
          <div id="link-error" class="error-message-form"></div>
        </div>
        <div class="flex-column">
          <input
            id="email"
            class="form-input"
            type="email"
            placeholder="Email"
            value="${email}"
          />
          <div id="email-error" class="error-message-form"></div>
        </div>
        <div class="flex justify-between form-group">
          <div class="phone-number-input flex-column">
            <input
              id="phone"
              class="form-input"
              placeholder="Mobile No"
              type="text"
              value="${phone}"
            />
            <div id="phone-error" class="error-message-form"></div>
          </div>
          <div class="form-select flex-column">
            <select id="status-type" name="status-type" class="form-input-select">
              <option value="">Select Status</option>
              <option value="Paused" ${status === 'Paused' ? 'selected' : ''}>Paused</option>
              <option value="Active" ${status === 'Active' ? 'selected' : ''}>Active</option>
            </select>
            <div id="status-error" class="error-message-form"></div>
          </div>
        </div>
        <div class="flex justify-end btn-modal-group">
          <button class="btn btn-submit" id="add-ads-submit">
            ${id ? 'Save Ads ' : 'Add Ads'}
          </button>
          <button id="add-ads-cancel" class="btn btn-close-modal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
};
