import {
  RESET_SCREENING_INFORMATION_FORM_FIELD_VALUES,
  SET_SCREENING_INFORMATION_FORM_FIELD,
  TOUCH_SCREENING_INFORMATION_FORM_FIELD,
  TOUCH_ALL_SCREENING_INFORMATION_FORM_FIELDS,
} from 'actions/screeningInformationFormActions'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {toUntouchedObject} from 'utils/formTouch'
import {Map} from 'immutable'

const FIELDS = ['name', 'assignee', 'report_type', 'started_at', 'ended_at', 'communication_method']

export default createReducer(Map(), {
  [FETCH_SCREENING_COMPLETE](state, {payload: {screening}, error}) {
    if (error) { return state }
    return toUntouchedObject(FIELDS, screening)
  },
  [RESET_SCREENING_INFORMATION_FORM_FIELD_VALUES](state, {payload}) {
    return FIELDS.reduce(
      (newState, field) => newState.setIn([field, 'value'], payload[field]),
      state
    )
  },
  [SET_SCREENING_INFORMATION_FORM_FIELD](state, {payload: {field, value}}) {
    return state.setIn([field, 'value'], value)
  },
  [TOUCH_SCREENING_INFORMATION_FORM_FIELD](state, {payload: {field}}) {
    return state.setIn([field, 'touched'], true)
  },
  [TOUCH_ALL_SCREENING_INFORMATION_FORM_FIELDS](state, _) {
    return FIELDS.reduce(
      (newState, field) => newState.setIn([field, 'touched'], true),
      state
    )
  },
})
