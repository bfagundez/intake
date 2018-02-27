import NarrativeForm from 'views/NarrativeForm'
import {
  getReportNarrativeValueSelector,
  getVisibleErrorsSelector,
} from 'selectors/screening/narrativeFormSelectors'
import {setField, touchField, touchAllFields} from 'actions/narrativeFormActions'
import {saveCard, clearCardEdits} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
  {
    reportNarrative: {
      value: getReportNarrativeValueSelector(state),
      errors: getVisibleErrorsSelector(state).get('report_narrative').toJS(),
    },
  }
)

const mapDispatchToProps = (dispatch) => ({
  onBlur: (fieldName) => dispatch(touchField(fieldName)),
  onCancel: () => {
    dispatch(clearCardEdits('narrative'))
    dispatch(touchAllFields())
    dispatch(setCardMode('narrative-card', SHOW_MODE))
  },
  onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
  onSave: () => {
    dispatch(saveCard('narrative'))
    dispatch(touchAllFields())
    dispatch(setCardMode('narrative-card', SHOW_MODE))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(NarrativeForm)
