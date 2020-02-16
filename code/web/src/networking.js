import axios from 'axios';


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
}, async function (error) {
  if (error?.response?.status === 401) {
    const refresh = localStorage.getItem('refreshToken')
    if (!refresh) {
      return Promise.reject(error);
    }

    const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh })
    if (!response.error) {
      localStorage.setItem('accessToken', response.data.access)
      window.location.reload()
    }
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


export default instance