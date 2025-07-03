// Label validation utility to check for proper form field associations
export const validateLabelAssociations = () => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check all labels with for attribute
  const labelsWithFor = document.querySelectorAll('label[for]');
  labelsWithFor.forEach((label, index) => {
    const forValue = label.getAttribute('for');
    if (forValue) {
      const targetElement = document.getElementById(forValue);
      
      if (!targetElement) {
        errors.push(`Label ${index + 1} with for="${forValue}" has no corresponding element with id="${forValue}"`);
      } else {
        // Check if target is a form element
        const validFormTags = ['input', 'select', 'textarea', 'button'];
        const tagName = targetElement.tagName.toLowerCase();
        
        if (!validFormTags.includes(tagName)) {
          warnings.push(`Label ${index + 1} with for="${forValue}" points to non-form element: ${tagName}`);
        }
      }
    }
  });
  
  // Check labels without for attribute
  const labelsWithoutFor = document.querySelectorAll('label:not([for])');
  labelsWithoutFor.forEach((label, index) => {
    // Check if it contains a form element (nested association)
    const nestedFormElement = label.querySelector('input, select, textarea');
    
    if (!nestedFormElement) {
      // This might be a display label, not a form label
      const labelText = label.textContent?.trim() || '';
      const className = label.className;
      
      // Skip if it's clearly a display label (has certain classes or contexts)
      if (className.includes('display') || className.includes('info') || 
          labelText.includes(':') || label.closest('.info-card, .display-section')) {
        return; // Skip display labels
      }
      
      warnings.push(`Label ${index + 1} "${labelText}" has no associated form field (no for attribute and no nested input)`);
    }
  });
  
  // Check form elements without labels
  const formElements = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea');
  formElements.forEach((element, index) => {
    const id = element.getAttribute('id');
    const name = element.getAttribute('name');
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    
    // Check if element has a label
    const hasLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
    const isNested = element.closest('label');
    
    if (!hasLabel && !isNested && !ariaLabel && !ariaLabelledBy) {
      const tagName = element.tagName.toLowerCase();
      const type = element.getAttribute('type') || '';
      const placeholder = element.getAttribute('placeholder') || '';
      
      warnings.push(`${tagName}${type ? `[type="${type}"]` : ''} ${index + 1} ${placeholder ? `(placeholder: "${placeholder}")` : ''} has no associated label`);
    }
  });
  
  return { errors, warnings };
};

export const logLabelValidationResults = () => {
  const { errors, warnings } = validateLabelAssociations();
  
  if (errors.length > 0) {
    console.error('🚨 Label Association Errors:');
    errors.forEach((error, index) => {
      console.error(`${index + 1}. ${error}`);
    });
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️ Label Association Warnings:');
    warnings.forEach((warning, index) => {
      console.warn(`${index + 1}. ${warning}`);
    });
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All labels are properly associated with form fields');
  }
  
  return { errors, warnings };
};

// Suggest fixes for common label issues
export const suggestLabelFixes = () => {
  const { errors, warnings } = validateLabelAssociations();
  const suggestions: string[] = [];
  
  if (errors.length > 0) {
    suggestions.push('🔧 To fix label errors:');
    suggestions.push('- Add matching id attributes to form elements');
    suggestions.push('- Or nest form elements inside labels');
    suggestions.push('- Or use aria-labelledby attribute');
  }
  
  if (warnings.length > 0) {
    suggestions.push('💡 To improve accessibility:');
    suggestions.push('- Add htmlFor/for attributes to all form labels');
    suggestions.push('- Use aria-label for elements without visible labels');
    suggestions.push('- Replace display labels with semantic elements (div, span, p)');
  }
  
  return suggestions;
};

// Auto-run validation in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const results = logLabelValidationResults();
        const suggestions = suggestLabelFixes();
        
        if (suggestions.length > 0) {
          console.group('💡 Label Accessibility Suggestions:');
          suggestions.forEach(suggestion => console.log(suggestion));
          console.groupEnd();
        }
      }, 2000);
    });
  }
} 