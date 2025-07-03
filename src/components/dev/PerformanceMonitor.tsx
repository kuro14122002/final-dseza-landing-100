import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  memoryInfo?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Only show in development
    if (import.meta.env.DEV) {
      collectMetrics();
      
      // Track path changes for SPAs
      const handlePathChange = () => {
        const newPath = window.location.pathname;
        if (newPath !== currentPath) {
          setCurrentPath(newPath);
          collectMetrics();
        }
      };

      // Listen for history changes (back/forward buttons)
      window.addEventListener('popstate', handlePathChange);
      
      // Listen for programmatic navigation
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        originalPushState.apply(history, args);
        setTimeout(handlePathChange, 0);
      };
      
      history.replaceState = function(...args) {
        originalReplaceState.apply(history, args);
        setTimeout(handlePathChange, 0);
      };

      return () => {
        window.removeEventListener('popstate', handlePathChange);
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
      };
    }
  }, [currentPath]);

  const collectMetrics = () => {
    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  };

  const measurePerformance = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    
    const firstPaint = paint.find(entry => entry.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

    // Get Web Vitals if available
    let largestContentfulPaint: number | undefined;
    let cumulativeLayoutShift: number | undefined;
    let firstInputDelay: number | undefined;

    // LCP
    if ('LargestContentfulPaint' in window) {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          largestContentfulPaint = entries[entries.length - 1].startTime;
          updateMetrics();
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // CLS
    if ('LayoutShift' in window) {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        cumulativeLayoutShift = clsValue;
        updateMetrics();
      }).observe({ entryTypes: ['layout-shift'] });
    }

    // FID
    if ('FirstInputDelay' in window) {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          firstInputDelay = (entry as any).processingStart - entry.startTime;
          updateMetrics();
          break;
        }
      }).observe({ entryTypes: ['first-input'] });
    }

    // Memory info (Chrome only)
    const memoryInfo = (performance as any).memory ? {
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
    } : undefined;

    const updateMetrics = () => {
      setMetrics({
        loadTime,
        domContentLoaded,
        firstPaint,
        firstContentfulPaint,
        largestContentfulPaint,
        cumulativeLayoutShift,
        firstInputDelay,
        memoryInfo,
      });
    };

    updateMetrics();
  };

  const formatTime = (time: number) => `${Math.round(time)}ms`;
  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getScoreColor = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'text-gray-600';

    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Don't render in production
  if (!import.meta.env.DEV || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-20 h-10">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-full h-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Monitor"
        style={{ minWidth: '80px', minHeight: '40px' }}
      >
        📊 Perf
      </button>

      {/* Metrics Panel */}
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto transform-gpu"
             style={{ 
               willChange: 'transform',
               backfaceVisibility: 'hidden'
             }}
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Performance Metrics
          </h3>
          
          <div className="space-y-2 text-sm">
            {/* Loading Metrics */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Loading</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Load Time:</span>
                  <span className="ml-1 font-mono">{formatTime(metrics.loadTime)}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">DOM Ready:</span>
                  <span className="ml-1 font-mono">{formatTime(metrics.domContentLoaded)}</span>
                </div>
              </div>
            </div>

            {/* Paint Metrics */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Paint</h4>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">First Paint:</span>
                  <span className="ml-1 font-mono">{formatTime(metrics.firstPaint)}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">FCP:</span>
                  <span className={`ml-1 font-mono ${getScoreColor('fcp', metrics.firstContentfulPaint)}`}>
                    {formatTime(metrics.firstContentfulPaint)}
                  </span>
                </div>
                {metrics.largestContentfulPaint && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">LCP:</span>
                    <span className={`ml-1 font-mono ${getScoreColor('lcp', metrics.largestContentfulPaint)}`}>
                      {formatTime(metrics.largestContentfulPaint)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Web Vitals */}
            {(metrics.cumulativeLayoutShift !== undefined || metrics.firstInputDelay !== undefined) && (
              <div className="border-b border-gray-200 dark:border-gray-600 pb-2">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Web Vitals</h4>
                <div className="grid grid-cols-1 gap-2">
                  {metrics.cumulativeLayoutShift !== undefined && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">CLS:</span>
                      <span className={`ml-1 font-mono ${getScoreColor('cls', metrics.cumulativeLayoutShift)}`}>
                        {metrics.cumulativeLayoutShift.toFixed(3)}
                      </span>
                    </div>
                  )}
                  {metrics.firstInputDelay !== undefined && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">FID:</span>
                      <span className={`ml-1 font-mono ${getScoreColor('fid', metrics.firstInputDelay)}`}>
                        {formatTime(metrics.firstInputDelay)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Memory Info */}
            {metrics.memoryInfo && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Memory</h4>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Used:</span>
                    <span className="ml-1 font-mono">{formatBytes(metrics.memoryInfo.usedJSHeapSize)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                    <span className="ml-1 font-mono">{formatBytes(metrics.memoryInfo.totalJSHeapSize)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Limit:</span>
                    <span className="ml-1 font-mono">{formatBytes(metrics.memoryInfo.jsHeapSizeLimit)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🟢 Good • 🟡 Needs Improvement • 🔴 Poor
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor; 