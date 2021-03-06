import axios from '../networking';

import createDataContext from './createDataContext';
import * as u from '../common/utils';


const checklistRunListURL = '/api/check-list-runs/';
const SET_CURRENT_RUN = 'SET_CURRENT_RUN'
const SET_CHECKLIST_RUNS = 'SET_CHECKLIST_RUNS'


const initialData = {
  currentChecklistRun: null,
  checklistRuns: null,
}

const reducer = (state = initialData, action) => {
  switch (action.type) {
    case SET_CURRENT_RUN:
      return { ...state, currentChecklistRun: action.payload }
    case SET_CHECKLIST_RUNS:
      return { ...state, checklistRuns: action.payload }
    default:
      return state
  }
}


const createChecklistRun = dispatch => async (checklistUrl) => {
  try {
    const response = await axios.post(checklistRunListURL, { checklist: checklistUrl })
    // dispatch({ type: SET_CURRENT_RUN, payload: response.data })
    return response
  } catch (err) {
    return { ...err.response, error: true }
  }
}

const fetchChecklistRun = dispatch => async (pk) => {
  try {
    const response = await axios.get(`${checklistRunListURL}${pk}/`)
    dispatch({ type: SET_CURRENT_RUN, payload: response.data })
    return response
  } catch (err) {
    return { ...err.response, error: true }
  }
}

const fetchChecklistRuns = dispatch => async ({ filters }) => {
  const queryParams = u.getQueryParamsString(filters);
  try {
    const response = await axios.get(`${checklistRunListURL}${queryParams}`)
    dispatch({ type: SET_CHECKLIST_RUNS, payload: response.data })
    return response
  } catch (err) {
    return { ...err.response, error: true }
  }
}

const updateChecklistRun = dispatch => async (checklistRun, values) => {
  try {
    const response = await axios.patch(checklistRun.url, values)
    dispatch({ type: SET_CURRENT_RUN, payload: response.data })
    return response
  } catch (err) {
    return { ...err.response, error: true }
  }
}


const updateChecklistRunItem = dispatch => async (item, isChecked) => {
  try {
    const response = await axios.patch(item.url, { is_checked: isChecked })
    return response
  } catch (err) {
    return { ...err.response, error: true }
  }
}

const deleteChecklistRun = dispatch => async (checklistRun) => {
  try {
    const response = await axios.delete(checklistRun.url)
    return response
  } catch (err) {
    return { ...err.response, error: true }
  }
}

const unsetCurrentChecklistRun = dispatch => async () => {
  dispatch({ type: SET_CURRENT_RUN, payload: null })
}

export const { Provider, Context } = createDataContext(
  reducer,
  {
    createChecklistRun,
    updateChecklistRunItem,
    fetchChecklistRun,
    unsetCurrentChecklistRun,
    updateChecklistRun,
    fetchChecklistRuns,
    deleteChecklistRun,
  },
  initialData,
)