import axios from '../networking';

import createDataContext from './createDataContext';


const checklistListURL = '/api/check-lists/';
const SET_CHECK_LISTS = 'SET_CHECK_LISTS';
const SET_CURRENT_CHECK_LIST = 'SET_CURRENT_CHECK_LIST';
const SET_CHECK_LIST_FORM_ERRORS = 'SET_CHECK_LIST_FORM_ERRORS';


const initialData = {
  checklists: null,
  currentChecklist: null,
  checklistFormErrors: {}
}

const reducer = (state = null, action) => {
  switch (action.type) {
    case SET_CHECK_LISTS:
      return { ...state, checklists: action.payload }
    case SET_CURRENT_CHECK_LIST:
      return { ...state, currentChecklist: action.payload }
    case SET_CHECK_LIST_FORM_ERRORS:
      return { ...state, checklistFormErrors: action.payload }
    default:
      return state
  }
}

const fetchChecklists = dispatch => async () => {
  try {
    const request = await axios.get(checklistListURL);
    const temp = await dispatch({ type: SET_CHECK_LISTS, payload: request.data })
  } catch (err) {
  }
}

const fetchCurrentChecklist = (dispatch) => async (id) => {
  try {
    const request = await axios.get(`${checklistListURL}${id}/`)
    dispatch({ type: SET_CURRENT_CHECK_LIST, payload: request.data })
  } catch (err) {

  }
}

const setCurrentChecklist = dispatch => (currentChecklist) => {
  dispatch({ type: SET_CURRENT_CHECK_LIST, payload: currentChecklist })
}

const unsetCurrentChecklist = dispatch => () => {
  dispatch({ type: SET_CURRENT_CHECK_LIST, payload: null })
}

const addChecklist = (dispatch) => async (values) => {
  try {
    const response = await axios.post(checklistListURL, values)
    return response
  } catch (err) {
    return { ...err.response, error: true }
  }
}


const deleteChecklist = (dispatch) => async (url) => {
  try {
    const response = await axios.delete(url)
    return response
  } catch (err) {

  }
}

const updateChecklist = (dispatch) => async (id, values) => {
  let response = {}
  try {
    response = await axios.patch(`${checklistListURL}${id}/`, values)
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
    fetchChecklists,
    setCurrentChecklist,
    unsetCurrentChecklist,
    fetchCurrentChecklist,
    addChecklist,
    updateChecklist,
    deleteChecklist,
  },
  initialData,
)