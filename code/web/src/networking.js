import axios from 'axios';

import * as storage from './utils/storage';


let baseURL = 'https://api.checkma.it'

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:8000'
}

const instance = axios.create({
  baseURL
});


instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
  console.log('Success???')
}, async function (error) {
  console.log('Happens')
  if (error?.response?.status === 401) {
    const refresh = localStorage.getItem('refreshToken')
    if (!refresh) {
      return Promise.reject(error);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh })
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