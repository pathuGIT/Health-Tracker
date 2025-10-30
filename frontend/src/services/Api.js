import axios from 'axios';

const api = axios.create({
  baseURL: 'https://health-tracker-orionx-escsczh2gcedbzfy.eastasia-01.azurewebsites.net/api',
});

// Attach token to requests, but NOT for refresh endpoint
api.interceptors.request.use((config) => {
  // ✅ Don't add Authorization header for refresh-token endpoint
  if (config.url && config.url.includes('/auth/refresh-token')) {
    return config;
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 403 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log('Interceptor triggered:', {
      status: error.response?.status,
      url: originalRequest?.url,
      isRetry: originalRequest?._retry
    });

    // ✅ CRITICAL: Prevent infinite loop for refresh endpoint
    if (originalRequest.url === '/auth/refresh-token') {
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (
      error.response?.status === 403 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.log('No refresh token found, redirecting to login');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        
        // ✅ Create a NEW axios instance without interceptors for refresh call
        const refreshApi = axios.create({
          baseURL: 'https://health-tracker-orionx-escsczh2gcedbzfy.eastasia-01.azurewebsites.net/api',
        });
        
        const { data } = await refreshApi.post('/auth/refresh-token', {
          refreshToken: refreshToken
        });
        
        const newToken = data.data.activeToken;
        localStorage.setItem('token', newToken);

        // ✅ Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;