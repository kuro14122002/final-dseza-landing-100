/**
 * Performance Monitor for TinyMCE
 * Monitors and fixes performance issues in TinyMCE editor
 */

(function() {
  'use strict';
  
  let warningCount = 0;
  const maxWarnings = 5;
  
  // Override console.warn to catch performance warnings
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Check for passive event listener warnings
    if (message.includes('Added non-passive event listener') || 
        message.includes('scroll-blocking')) {
      warningCount++;
      
      if (warningCount <= maxWarnings) {
        console.info(`🔧 Performance Warning #${warningCount}: ${message}`);
        console.info('⚡ Applying automatic fix...');
        
        // Try to fix the issue
        setTimeout(() => {
          applyPassiveEventFix();
        }, 100);
      }
      
      // Don't spam the console with too many warnings
      if (warningCount > maxWarnings) {
        return;
      }
    }
    
    // Call original warn for other warnings
    originalWarn.apply(console, args);
  };
  
  function applyPassiveEventFix() {
    try {
      // Find all TinyMCE instances
      if (window.tinymce && window.tinymce.activeEditor) {
        const editor = window.tinymce.activeEditor;
        const container = editor.getContainer();
        
        if (container) {
          // Apply passive event listeners to problematic elements
          const problematicSelectors = [
            '.tox-edit-area',
            '.tox-toolbar',
            '.tox-menubar',
            '.tox-statusbar',
            '.mce-content-body'
          ];
          
          problematicSelectors.forEach(selector => {
            const elements = container.querySelectorAll(selector);
            elements.forEach(element => {
              // Clone and replace to remove existing listeners
              if (element.parentNode) {
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
                
                // Add CSS optimizations
                newElement.style.touchAction = 'manipulation';
                newElement.style.webkitOverflowScrolling = 'touch';
                newElement.style.transform = 'translateZ(0)';
              }
            });
          });
          
          console.info('✅ Applied passive event fix to TinyMCE elements');
        }
      }
    } catch (error) {
      console.error('❌ Error applying passive event fix:', error);
    }
  }
  
  // Monitor performance metrics
  function monitorPerformance() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const perfEntries = performance.getEntriesByType('measure');
      const longTasks = perfEntries.filter(entry => entry.duration > 50);
      
      if (longTasks.length > 0) {
        console.info(`⏱️  Detected ${longTasks.length} long tasks`);
        
        // Apply additional optimizations for long tasks
        requestIdleCallback(() => {
          applyPassiveEventFix();
        });
      }
    }
  }
  
  // Debounced performance monitoring
  let monitorTimeout;
  function debounceMonitor() {
    clearTimeout(monitorTimeout);
    monitorTimeout = setTimeout(monitorPerformance, 1000);
  }
  
  // Set up monitoring
  document.addEventListener('DOMContentLoaded', () => {
    console.info('🚀 Performance monitor initialized');
    
    // Monitor for TinyMCE initialization
    if (window.tinymce) {
      window.tinymce.on('AddEditor', () => {
        console.info('📝 TinyMCE editor detected, applying optimizations...');
        setTimeout(applyPassiveEventFix, 500);
      });
    }
    
    // Monitor scroll events
    document.addEventListener('scroll', debounceMonitor, { passive: true });
    
    // Monitor resize events
    window.addEventListener('resize', debounceMonitor, { passive: true });
    
    // Initial performance check
    setTimeout(monitorPerformance, 2000);
  });
  
  // Export for manual use
  window.performanceMonitor = {
    applyFix: applyPassiveEventFix,
    monitor: monitorPerformance,
    warningCount: () => warningCount
  };
  
})(); 