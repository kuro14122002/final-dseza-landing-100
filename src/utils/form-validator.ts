// Form validation utility to check for missing id/name attributes
export const validateFormElements = () => {
  const errors: string[] = [];
  
  // Check all form elements
  const formElements = document.querySelectorAll('input, select, textarea');
  
  formElements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const id = element.getAttribute('id');
    const name = element.getAttribute('name');
    const type = element.getAttribute('type');
    const className = element.className;
    
    // Skip certain elements that don't need id/name
    const skipElements = [
      'button', // buttons with type="button"
      'submit', // submit buttons
      'reset',  // reset buttons
      'checkbox', // checkboxes often don't need name if controlled
      'radio'   // radio buttons often don't need name if controlled
    ];
    
    // Skip hidden inputs that are often used for frameworks
    if (type === 'hidden') return;
    
    // Skip elements with certain classes (React internal elements)
    if (className.includes('react-') || className.includes('_react') || className.includes('hidden')) {
      return;
    }
    
    if (!id && !name) {
      const elementInfo = `${tagName}${type ? `[type="${type}"]` : ''}${className ? ` (class: ${className.split(' ').slice(0, 2).join(' ')})` : ''}`;
      errors.push(`Element ${index + 1}: ${elementInfo} has neither id nor name attribute`);
    }
  });
  
  return errors;
};

export const logFormValidationErrors = () => {
  const errors = validateFormElements();
  
  if (errors.length > 0) {
    console.warn('🔍 Form Validation Issues Found:');
    console.warn(`Found ${errors.length} form element(s) without id or name attributes:`);
    errors.forEach((error, index) => {
      console.warn(`${index + 1}. ${error}`);
    });
    console.warn('\n💡 To fix: Add id or name attributes to form elements for better accessibility and autofill support.');
  } else {
    console.log('✅ All form elements have proper id or name attributes');
  }
  
  return errors;
};

// Check for specific patterns that might need attention
export const validateAccessibilityPatterns = () => {
  const issues: string[] = [];
  
  // Check for labels without proper associations
  const labels = document.querySelectorAll('label[for]');
  labels.forEach((label) => {
    const forValue = label.getAttribute('for');
    if (forValue) {
      const targetElement = document.getElementById(forValue);
      if (!targetElement) {
        issues.push(`Label with for="${forValue}" has no corresponding element`);
      }
    }
  });
  
  // Check for inputs without labels
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    const hasLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
    const hasAriaLabel = input.getAttribute('aria-label');
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      const type = input.getAttribute('type') || 'text';
      issues.push(`Input[type="${type}"] without proper labeling (no label, aria-label, or aria-labelledby)`);
    }
  });
  
  return issues;
};

// Auto-run validation in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        logFormValidationErrors();
        
        const accessibilityIssues = validateAccessibilityPatterns();
        if (accessibilityIssues.length > 0) {
          console.warn('🔍 Accessibility Issues Found:');
          accessibilityIssues.forEach((issue, index) => {
            console.warn(`${index + 1}. ${issue}`);
          });
        }
      }, 1500); // Delay to ensure React components are fully rendered
    });
  }
} 