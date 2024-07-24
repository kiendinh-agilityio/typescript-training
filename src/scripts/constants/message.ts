// Messages
export const MESSAGES = {
  REQUEST_FAILED: 'Request failed!',
  NO_RESULT: 'No results were found!',
  DELETE_SUCCESS: 'You have deleted it successfully!',
  DELETE_ERROR: 'Failed to delete person with id!',
  ADD_ERROR: 'Failed to add new person!',
  ADD_SUCCESS: 'You have added it successfully!',
  EDIT_ERROR: 'Failed to edit person!',
  EDIT_SUCCESS: 'You have edited it successfully!',
  GET_DETAIL_ID_ERROR: 'Failed to get detail id person!',
  NO_CHANGES: 'No changes were made!',
  FILTER_FAILED: 'Failed to filter person by class!',
};

// Validate Message
export const VALIDATE_MESSAGES = {
  REQUIRED_ERROR: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_NAME:
    'Please enter a minimum of 4 and a maximum of 20 characters for the network',
  INVALID_SUBJECT: 'Please enter a valid subject',
  INVALID_AVATAR_URL: 'Please enter a valid avatar url',
};
