import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigationHook }from '../Utilities/navigationContext';
import { setAccessToken, getAccessToken, clearAccessToken } from '../Utilities/tokenManagement';
import { clearUserData } from '../stateManagement/authSlice'; 
import store from '../stateManagement/store'; 

const api = axios.create({
  baseURL: 'https://pettywallet.onrender.com/',
  // baseURL:'http://localhost:3001',
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: 'https://pettywallet.onrender.com/',
  // baseURL:'http://localhost:3001',
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

// Notify all subscribers of the new token
const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
};

// Add a callback to be executed once the token is refreshed
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.url !== '/refreshToken') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const { data } = await refreshApi.post('/refreshToken');
            if (!data || !data.accessToken) {
              // Handle missing access token
              clearAccessToken();
              localStorage.clear();
              store.dispatch(clearUserData());
              Cookies.remove('refreshToken', { path: '/' });
              // setTimeout(() => {
              //   window.location.href = '/login';
              // }, 0);
              const navigate = useNavigationHook();
              navigate('/login');
              return Promise.reject(new Error('No access token received'));
            }

            setAccessToken(data.accessToken);
            onRefreshed(data.accessToken);
            refreshSubscribers = [];
            isRefreshing = false;
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch (refreshErr) {
            // Handle refresh token errors, such as a 403 response
            isRefreshing = false;
            clearAccessToken();
            store.dispatch(clearUserData());
            localStorage.clear();
            Cookies.remove('refreshToken', { path: '/' });
            // window.location.href = '/login';
            // console.log("hi")
            const navigate = useNavigationHook();
            navigate('/login');
            return Promise.reject(new Error('Refresh token expired or invalid'));
          }
        }

        // If refreshing, wait for the new token
        const retryOriginalRequest = new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });

        return retryOriginalRequest;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
