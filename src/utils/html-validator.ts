// HTML validation utility to check for label-for issues
export const validateLabelsAndInputs = () => {
  const errors: string[] = [];
  
  // Check all labels with htmlFor/for attribute
  const labels = document.querySelectorAll('label[for]');
  
  labels.forEach((label) => {
    const forValue = label.getAttribute('for');
    if (forValue) {
      // Check if corresponding element exists
      const targetElement = document.getElementById(forValue);
      
      if (!targetElement) {
        errors.push(`Label with for="${forValue}" has no corresponding element with id="${forValue}"`);
      } else {
        // Check if target element is a valid form element
        const validFormElements = ['input', 'select', 'textarea', 'button'];
        const tagName = targetElement.tagName.toLowerCase();
        
        if (!validFormElements.includes(tagName)) {
          errors.push(`Label with for="${forValue}" points to invalid form element: ${tagName}`);
        }
      }
    }
  });
  
  // Check for duplicate IDs
  const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
  const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
  
  duplicateIds.forEach(id => {
    errors.push(`Duplicate ID found: "${id}"`);
  });
  
  return errors;
};

export const logValidationErrors = () => {
  const errors = validateLabelsAndInputs();
  
  if (errors.length > 0) {
    console.warn('HTML Validation Errors:');
    errors.forEach(error => console.warn('- ' + error));
  } else {
    console.log('✅ No label-for validation errors found');
  }
  
  return errors;
};

// Run validation in development mode
if (process.env.NODE_ENV === 'development') {
  // Run after DOM is loaded
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(logValidationErrors, 1000); // Delay to ensure all React components are rendered
    });
  }
} 