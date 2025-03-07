// Import validation functions
import {
  validateEmailField,
  validateAvatarField,
  validateNameField,
  validateSubjectField,
  validateClassField,
  validateGenderField,
} from '@/utils';

// Import interfaces
import {
  Person,
  Teacher,
  ModelValidation,
  isItemTeacher,
  PersonType,
} from '@/types';

// Function to validate an person form
export const validateForm = (
  item: Person | Teacher,
  personType: PersonType,
): ModelValidation => {
  // Destructure the personItem properties with default empty strings
  const {
    email = '',
    name = '',
    className = '',
    avatarUrl = '',
    gender = '',
  } = item || {};

  // Initialize an object to hold validation errors
  const errors: ModelValidation = {};

  // Validate the email field and add an error if validation fails
  const emailError = validateEmailField(email);
  if (emailError) {
    errors.email = emailError;
  }

  // Validate the name field and add an error if validation fails
  const nameError = validateNameField(name);
  if (nameError) {
    errors.name = nameError;
  }

  // Validate the class field and add an error if validation fails
  const classError = validateClassField(className);
  if (classError) {
    errors.className = classError;
  }

  // Validate the subject field and add an error if validation fails
  if (personType === PersonType.Teacher && isItemTeacher(item)) {
    const subjectError = validateSubjectField(item.subject);
    if (subjectError) {
      errors.subject = subjectError;
    }
  }

  // Validate the avatarUrl field and add an error if validation fails
  const avatarError = validateAvatarField(avatarUrl);
  if (avatarError) {
    errors.avatarUrl = avatarError;
  }

  // Validate the class field and add an error if validation fails
  const genderError = validateGenderField(gender);
  if (genderError) {
    errors.gender = genderError;
  }

  // Return the object containing all validation errors
  return errors;
};
