import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token anexado:', `Bearer ${token.substring(0, 10)}...`);
  } else {
    console.warn('Nenhum token encontrado no localStorage');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post('http://localhost:8000/api/auth/refresh/', {
            refresh: refreshToken,
          });
          const newAccessToken = res.data.access;
          localStorage.setItem('access_token', newAccessToken);
          
          // Re-attach token to the original request
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
