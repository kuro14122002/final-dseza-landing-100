// Debug utility for logging network requests and errors
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
  }
};

export const debugError = (message: string, error: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${message}`, error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
};

export const debugNetworkRequest = (method: string, url: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[NETWORK] ${method} ${url}`, data);
  }
}; 