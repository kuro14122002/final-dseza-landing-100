import React, { useEffect, useState } from 'react';
import { validateFormElements, validateAccessibilityPatterns } from '@/utils/form-validator';
import { validateLabelsAndInputs } from '@/utils/html-validator';
import { validateLabelAssociations } from '@/utils/label-validator';

interface ValidationIssue {
  type: 'form' | 'accessibility' | 'html' | 'label';
  message: string;
}

const ValidationStatus: React.FC = () => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkValidation = () => {
      const formErrors = validateFormElements();
      const accessibilityErrors = validateAccessibilityPatterns();
      const htmlErrors = validateLabelsAndInputs();
      const labelValidation = validateLabelAssociations();

      const allIssues: ValidationIssue[] = [
        ...formErrors.map(error => ({ type: 'form' as const, message: error })),
        ...accessibilityErrors.map(error => ({ type: 'accessibility' as const, message: error })),
        ...htmlErrors.map(error => ({ type: 'html' as const, message: error })),
        ...labelValidation.errors.map(error => ({ type: 'label' as const, message: error })),
        ...labelValidation.warnings.map(warning => ({ type: 'label' as const, message: warning }))
      ];

      setIssues(allIssues);
    };

    // Run validation after component mount and DOM updates
    const timer = setTimeout(checkValidation, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const hasIssues = issues.length > 0;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`px-4 py-2 rounded-lg text-white font-medium shadow-lg transition-colors ${
          hasIssues 
            ? 'bg-orange-500 hover:bg-orange-600' 
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {hasIssues ? `${issues.length} Form Issues` : '✅ No Issues'}
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Form Validation Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Development mode validation results
            </p>
          </div>
          
          {hasIssues ? (
            <div className="p-4 space-y-3">
              {issues.map((issue, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    issue.type === 'form' ? 'bg-red-500' :
                    issue.type === 'accessibility' ? 'bg-orange-500' :
                    issue.type === 'label' ? 'bg-purple-500' :
                    'bg-yellow-500'
                  }`} />
                  <div>
                    <div className={`text-xs font-medium ${
                      issue.type === 'form' ? 'text-red-600' :
                      issue.type === 'accessibility' ? 'text-orange-600' :
                      issue.type === 'label' ? 'text-purple-600' :
                      'text-yellow-600'
                    }`}>
                      {issue.type.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {issue.message}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  💡 Add id or name attributes to form elements for better accessibility and autofill support.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="text-green-600 dark:text-green-400 text-sm">
                ✅ All form elements have proper attributes!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationStatus; 