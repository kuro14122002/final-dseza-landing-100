import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './utils/html-validator.ts'; // Import HTML validator for development
import './utils/form-validator.ts'; // Import form validator for development
import './utils/label-validator.ts'; // Import label validator for development

createRoot(document.getElementById("root")!).render(<App />);
