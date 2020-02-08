import axios from 'axios';

import createDataContext from './createDataContext';


const checkListListURL = 'http://localhost:8000/api/check-lists/';
const SET_CHECK_LISTS = 'SET_CHECK_LISTS';
const SET_CURRENT_CHECK_LIST = 'SET_CURRENT_CHECK_LIST';
const SET_CHECK_LIST_FORM_ERRORS = 'SET_CHECK_LIST_FORM_ERRORS';


const initialData = {
  checkLists: null,
  currentCheckList: null,
  checklistFormErrors: {}
}

const reducer = (state = null, action) => {
  switch (action.type) {
    case SET_CHECK_LISTS:
      return { ...state, checkLists: action.payload }
    case SET_CURRENT_CHECK_LIST:
      return { ...state, currentCheckList: action.payload }
    case SET_CHECK_LIST_FORM_ERRORS:
      return { ...state, checklistFormErrors: action.payload }
    default:
      return state
  }
}

const fetchCheckLists = dispatch => async () => {
  try {
    const request = await axios.get(checkListListURL);
    const temp = await dispatch({ type: SET_CHECK_LISTS, payload: request.data })
  } catch (err) {
  }
}

const fetchCurrentChecklist = (dispatch) => async (id) => {
  try {
    const request = await axios.get(`${checkListListURL}${id}/`)
    dispatch({ type: SET_CURRENT_CHECK_LIST, payload: request.data })
  } catch (err) {

  }
}

const setCurrentCheckList = dispatch => (currentCheckList) => {
  dispatch({ type: SET_CURRENT_CHECK_LIST, payload: currentCheckList })
}

const unsetCurrentChecklist = dispatch => () => {
  dispatch({ type: SET_CURRENT_CHECK_LIST, payload: null })
}

const addChecklist = (dispatch) => async (values) => {
  try {
    const response = await axios.post(checkListListURL, values)
    return response
  } catch (err) {
    return { ...err.response, error: true }
  }
}

const updateChecklist = (dispatch) => async (id, values) => {
  let response = {}
  try {
    response = await axios.patch(`${checkListListURL}${id}/`, values)
  } catch (err) {
    return { ...err.response, error: true }
  }
  return response
}


const setChecklistFormErrors = dispatch => (errors) => {
  dispatch({ type: SET_CHECK_LIST_FORM_ERRORS, payload: errors })
}


export const { Provider, Context } = createDataContext(
  reducer,
  {
    fetchCheckLists,
    setCurrentCheckList,
    unsetCurrentChecklist,
    fetchCurrentChecklist,
    addChecklist,
    updateChecklist,
  },
  initialData,
)