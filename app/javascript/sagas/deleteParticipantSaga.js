import {takeEvery, put, call, select} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  deleteParticipantSuccess,
  deleteParticipantFailure,
  fetchScreening,
  fetchRelationships,
  fetchHistoryOfInvolvements,
} from 'actions/screeningActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {DELETE_PARTICIPANT} from 'actions/actionTypes'

export function* deleteParticipant({payload: {id}}) {
  try {
    yield call(destroy, `/api/v1/participants/${id}`)
    yield put(deleteParticipantSuccess(id))
    const screeningId = yield select(getScreeningIdValueSelector)
    yield put(fetchScreening(screeningId))
    yield put(fetchRelationships(screeningId))
    yield put(fetchHistoryOfInvolvements(screeningId))
  } catch (error) {
    yield put(deleteParticipantFailure(error.responseJSON))
  }
}
export function* deleteParticipantSaga() {
  yield takeEvery(DELETE_PARTICIPANT, deleteParticipant)
}
