export const setAccessToken = (token) => {
  window.accessToken = token;
};

export const getAccessToken = () => {
  return window.accessToken;
};


export const clearAccessToken = () => {
  delete window.accessToken; 
};

