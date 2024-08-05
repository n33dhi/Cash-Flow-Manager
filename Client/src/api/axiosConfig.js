import axios from 'axios';
import { getAccessToken, setAccessToken } from '../Utilities/tokenManagement'; 

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  config => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => {
    // Extract and set the access token from the response if available
    if (response.data && response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        api.post('/refreshToken')
          .then(({ data }) => {
            if (data.accessToken) {
              setAccessToken(data.accessToken);
              api.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
              originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
            }
            processQueue(null, data.accessToken);
            resolve(api(originalRequest));
          })
          .catch(err => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
