import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EntryPoint from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';


axios.interceptors.response.use(function (response) {
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



ReactDOM.render(<EntryPoint />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
