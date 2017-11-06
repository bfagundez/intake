import {takeEvery, put, call, select} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  DELETE_PERSON,
  deletePersonSuccess,
  deletePersonFailure,
} from 'actions/personCardActions'
import {
  fetchScreening,
  fetchRelationships,
  fetchHistoryOfInvolvements,
} from 'actions/screeningActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'

export function* deleteParticipant({payload: {id}}) {
  try {
    yield call(destroy, `/api/v1/participants/${id}`)
    yield put(deletePersonSuccess(id))
    const screeningId = yield select(getScreeningIdValueSelector)
    yield put(fetchScreening(screeningId))
    yield put(fetchRelationships(screeningId))
    yield put(fetchHistoryOfInvolvements(screeningId))
  } catch (error) {
    yield put(deletePersonFailure(error.responseJSON))
  }
}
export function* deleteParticipantSaga() {
  yield takeEvery(DELETE_PERSON, deleteParticipant)
}
