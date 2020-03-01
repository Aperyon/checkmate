import axios from '../networking';

import * as storage from '../utils/storage';
import createDataContext from './createDataContext';


const loginURL = '/api/token/'
const userListURL = '/api/users/';
const forgotPasswordURL = '/api/users/forgot-password/';
const resetPasswordURL = '/api/users/reset-password/';

const SET_AUTH_TOKENS = 'SET_AUTH_TOKENS'
const UNSET_AUTH_TOKENS = 'UNSET_AUTH_TOKENS'


const initialData = {
  isAuthenticated: false,
  tokens: null,
  user: null
}
const reducer = (state = initialData, action) => {
  switch (action.type) {
    case SET_AUTH_TOKENS:
      return { ...state, isAuthenticated: true, tokens: action.payload }
    case UNSET_AUTH_TOKENS:
      return initialData
    default:
      return state
  }
}


const localLoginUser = dispatch => () => {
  const access = localStorage.getItem('accessToken')
  const refresh = localStorage.getItem('refreshToken')

  if (refresh) {
    dispatch({ type: SET_AUTH_TOKENS, payload: { access, refresh } })
    setAxiosAuthHeader(access)
  } else {
  }
}


const loginUser = dispatch => async (values) => {
  try {
    const response = await axios.post(loginURL, values);
    dispatch({ type: SET_AUTH_TOKENS, payload: response.data })
    localStorage.setItem('accessToken', response.data.access)
    localStorage.setItem('refreshToken', response.data.refresh)
    setAxiosAuthHeader(response.data.access)
    return response
  } catch (err) {
    return { ...err.response, hasError: true }
  }
}

const logoutUser = dispatch => () => {
  dispatch({ type: UNSET_AUTH_TOKENS, payload: null })
  storage.removeTokensFromStorage()
}


const createUser = dispatch => async (values) => {
  try {
    const response = await axios.post(userListURL, values);
    return response
  } catch (err) {
    return { ...err.response, hasError: true }
  }
}


const sendForgotPassword = dispatch => async (values) => {
  try {
    const response = await axios.post(forgotPasswordURL, values);
    return response
  } catch (err) {
    return { ...err.response, hasError: true }
  }
}


const sendResetPassword = dispatch => async (uid, token, values) => {
  const url = `${resetPasswordURL}${uid}/${token}/`
  try {
    const response = await axios.post(url, values);
    return response
  } catch (err) {
    return { ...err.response, hasError: true }
  }
}


function setAxiosAuthHeader(access) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
}


export const { Provider, Context } = createDataContext(
  reducer,
  {
    loginUser,
    logoutUser,
    localLoginUser,
    createUser,
    sendForgotPassword,
    sendResetPassword,
  },
  initialData,
)