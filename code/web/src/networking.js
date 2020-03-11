import axios from 'axios';

import * as storage from './utils/storage';


let baseURL = 'https://api.loff.io'

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://192.168.1.66:8000'
}

const instance = axios.create({
  baseURL
});


instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, async function (error) {
  if (error?.response?.status === 401) {
    const refresh = localStorage.getItem('refreshToken')
    if (!refresh) {
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(`${baseURL}/api/token/refresh/`, { refresh })
      if (!response.error) {
        localStorage.setItem('accessToken', response.data.access)
        window.location.reload()
      } else {
      }
    } catch (err) {
      storage.removeTokensFromStorage()
      window.location = '/login/'
    }
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


export default instance