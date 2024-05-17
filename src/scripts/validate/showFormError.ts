interface Errors {
  [key: string]: string | undefined;
}

const updateErrorMessages = (errors: Errors): void => {
  Object.entries(errors).forEach(([key, value]) => {
    const target = document.getElementById(`${key}-error`);
    if (target) {
      // Ensure target.innerText is a string
      target.innerText = value || '';
    }
  });
};

export const showFormErrors = (errors: Errors): void => updateErrorMessages(errors);
