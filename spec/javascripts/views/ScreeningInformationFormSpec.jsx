import ScreeningInformationForm from 'views/ScreeningInformationForm'
import React from 'react'
import {shallow} from 'enzyme'
import {SafelySurrenderedBabyMessage} from 'views/ScreeningInformationHelpTextBox'

describe('ScreeningInformationForm', () => {
  function renderScreeningInformationForm({
    errors = {},
    communicationMethods = [],
    reportTypes = [],
    onCancel = () => {},
    onSave = () => {},
    ...args
  }) {
    const props = {errors, communicationMethods, reportTypes, onCancel, onSave, ...args}
    return shallow(<ScreeningInformationForm {...props} />, {disableLifecycleMethods: true})
  }

  it('renders the name field', () => {
    const titleField = renderScreeningInformationForm({
      name: 'A sample screening name',
    }).find('InputField[label="Title/Name of Screening"]')
    expect(titleField.props().value).toEqual('A sample screening name')
    expect(titleField.props().maxLength).toEqual('64')
    expect(titleField.props().allowCharacters).toEqual(/[a-zA-Z\s'’-]/)
  })

  it('calls on blur when name field is blurred', () => {
    const onBlur = jasmine.createSpy('onBlur')
    renderScreeningInformationForm({onBlur})
      .find('InputField[label="Title/Name of Screening"]')
      .simulate('blur')
    expect(onBlur).toHaveBeenCalledWith('name')
  })

  it('calls on change when name field is changed', () => {
    const onChange = jasmine.createSpy('onChange')
    renderScreeningInformationForm({onChange})
      .find('InputField[label="Title/Name of Screening"]')
      .simulate('change', {target: {value: 'new name'}})
    expect(onChange).toHaveBeenCalledWith('name', 'new name')
  })

  it('renders the assigned social worker field', () => {
    const assigneeField = renderScreeningInformationForm({
      assignee: 'A sample assignee',
    }).find('InputField[label="Assigned Social Worker"]')
    expect(assigneeField.props().value).toEqual('A sample assignee')
    expect(assigneeField.props().maxLength).toEqual('64')
    expect(assigneeField.props().allowCharacters).toEqual(/[a-zA-Z\s]/)
    expect(assigneeField.props().required).toEqual(true)
  })

  it('renders the assignee field errors', () => {
    const assignee = renderScreeningInformationForm({
      errors: {assignee: ['Error 1']},
    }).find('InputField[label="Assigned Social Worker"]')
    expect(assignee.props().errors).toEqual(
      ['Error 1']
    )
  })

  it('calls on blur when assignee field is blurred', () => {
    const onBlur = jasmine.createSpy('onBlur')
    renderScreeningInformationForm({onBlur})
      .find('InputField[label="Assigned Social Worker"]')
      .simulate('blur')
    expect(onBlur).toHaveBeenCalledWith('assignee')
  })

  it('calls on change when assignee field is changed', () => {
    const onChange = jasmine.createSpy('onChange')
    renderScreeningInformationForm({onChange})
      .find('InputField[label="Assigned Social Worker"]')
      .simulate('change', {target: {value: 'new assignee'}})
    expect(onChange).toHaveBeenCalledWith('assignee', 'new assignee')
  })

  it('renders the report type', () => {
    const component = renderScreeningInformationForm({
      reportType: 'Safely Surrendered Baby',
    }).find('SelectField[label="Report Type"]')
    expect(component.props().value).toEqual('Safely Surrendered Baby')
  })

  it('calls on blur when report type field is blurred', () => {
    const onBlur = jasmine.createSpy('onBlur')
    renderScreeningInformationForm({onBlur})
      .find('SelectField[label="Report Type"]')
      .simulate('blur')
    expect(onBlur).toHaveBeenCalledWith('report_type')
  })

  it('calls on change when report type field is changed', () => {
    const onChange = jasmine.createSpy('onChange')
    renderScreeningInformationForm({onChange})
      .find('SelectField[label="Report Type"]')
      .simulate('change', {target: {value: 'new report type'}})
    expect(onChange).toHaveBeenCalledWith('report_type', 'new report type')
  })

  describe('Alert info messages', () => {
    it('renders an alert info message when ssb is selected', () => {
      const component = renderScreeningInformationForm({reportType: 'ssb'})
      expect(component.find('AlertInfoMessage').exists()).toEqual(true)
      expect(component.find('AlertInfoMessage').props().message).toEqual(<SafelySurrenderedBabyMessage/>)
    })
    it('does not render an alert info message when csec is selected', () => {
      const component = renderScreeningInformationForm({reportType: 'csec'})
      expect(component.find('AlertInfoMessage').exists()).toEqual(false)
    })
    it('does not render an alert info message when report type values is not selected', () => {
      const component = renderScreeningInformationForm({reportType: undefined})
      expect(component.find('AlertInfoMessage').exists()).toEqual(false)
    })
  })

  it('renders the screening start time field', () => {
    const component = renderScreeningInformationForm({
      startedAt: '2016-08-13T10:00:00.000Z',
    }).find('DateField[label="Screening Start Date/Time"]')
    expect(component.props().value).toEqual('2016-08-13T10:00:00.000Z')
    expect(component.props().required).toEqual(true)
  })

  it('renders the started_at field errors', () => {
    const startedAt = renderScreeningInformationForm({
      errors: {started_at: ['Error 2']},
    }).find('DateField[label="Screening Start Date/Time"]')
    expect(startedAt.props().errors).toEqual(['Error 2'])
  })

  it('calls on blur when start time field is blurred', () => {
    const onBlur = jasmine.createSpy('onBlur')
    renderScreeningInformationForm({onBlur})
      .find('DateField[label="Screening Start Date/Time"]')
      .simulate('blur')
    expect(onBlur).toHaveBeenCalledWith('started_at')
  })

  it('calls on change when start time field is changed', () => {
    const onChange = jasmine.createSpy('onChange')
    renderScreeningInformationForm({onChange})
      .find('DateField[label="Screening Start Date/Time"]')
      .simulate('change', 'new start time')
    expect(onChange).toHaveBeenCalledWith('started_at', 'new start time')
  })

  it('renders the screening end time field', () => {
    const component = renderScreeningInformationForm({
      endedAt: '2016-08-22T11:00:00.000Z',
    }).find('DateField[label="Screening End Date/Time"]')
    expect(component.props().value).toEqual('2016-08-22T11:00:00.000Z')
  })

  it('renders the ended_at field errors', () => {
    const endedAt = renderScreeningInformationForm({
      errors: {ended_at: ['Error 3']},
    }).find('DateField[label="Screening End Date/Time"]')
    expect(endedAt.props().errors).toEqual(['Error 3'])
  })

  it('calls on blur when end time field is blurred', () => {
    const onBlur = jasmine.createSpy('onBlur')
    renderScreeningInformationForm({onBlur})
      .find('DateField[label="Screening End Date/Time"]')
      .simulate('blur')
    expect(onBlur).toHaveBeenCalledWith('ended_at')
  })

  it('calls on change when end time field is changed', () => {
    const onChange = jasmine.createSpy('onChange')
    renderScreeningInformationForm({onChange})
      .find('DateField[label="Screening End Date/Time"]')
      .simulate('change', 'new end time')
    expect(onChange).toHaveBeenCalledWith('ended_at', 'new end time')
  })

  it('renders the communication method', () => {
    const component = renderScreeningInformationForm({
      communicationMethod: 'mail',
    }).find('SelectField[label="Communication Method"]')
    expect(component.props().value).toEqual('mail')
    expect(component.props().required).toEqual(true)
  })

  it('renders the communication method field errors', () => {
    const communicationMethod = renderScreeningInformationForm({
      errors: {communication_method: ['Error 4']},
    }).find('SelectField[label="Communication Method"]')
    expect(communicationMethod.props().errors).toEqual(['Error 4'])
  })

  it('calls on blur when communication method field is blurred', () => {
    const onBlur = jasmine.createSpy('onBlur')
    renderScreeningInformationForm({onBlur})
      .find('SelectField[label="Communication Method"]')
      .simulate('blur')
    expect(onBlur).toHaveBeenCalledWith('communication_method')
  })

  it('calls on change when communication method field is changed', () => {
    const onChange = jasmine.createSpy('onChange')
    renderScreeningInformationForm({onChange})
      .find('SelectField[label="Communication Method"]')
      .simulate('change', {target: {value: 'new communication method'}})
    expect(onChange).toHaveBeenCalledWith('communication_method', 'new communication method')
  })

  it('does not disable assigned social worker if assigneeDisabled is false', () => {
    const component = renderScreeningInformationForm({
      assigneeDisabled: false,
    }).find('InputField[label="Assigned Social Worker"]')
    expect(component.props().disabled).toBeFalsy()
  })

  it('disables assigned social worker if assigneeDisabled is true', () => {
    const component = renderScreeningInformationForm({
      assigneeDisabled: true,
    }).find('InputField[label="Assigned Social Worker"]')
    expect(component.props().disabled).toEqual(true)
  })

  it('displays communication method options', () => {
    const communicationMethods = [
      {value: 'option_1', label: 'option 1'},
      {value: 'option_2', label: 'option 2'},
      {value: 'option_3', label: 'option 3'},
    ]
    const select = renderScreeningInformationForm({communicationMethods})
      .find('SelectField[label="Communication Method"]')
    const selectOptions = select.find('option').getElements()
    expect(selectOptions.length).toEqual(4)
    expect(selectOptions[0].props.value).toEqual(undefined)
    expect(selectOptions[1].props.value).toEqual('option_1')
    expect(selectOptions[2].props.value).toEqual('option_2')
    expect(selectOptions[3].props.value).toEqual('option_3')
  })

  it('renders a card action row', () => {
    const component = renderScreeningInformationForm({})
    expect(component.find('ActionRow').exists()).toEqual(true)
    expect(component.find('ActionRow').props().isSaving).not.toBeTruthy()
  })

  it('passes isSaving through to ActionRow', () => {
    const component = renderScreeningInformationForm({isSaving: true})
    expect(component.find('ActionRow').props().isSaving).toEqual(true)
  })

  it('canceling edit calls onCancel', () => {
    const onCancel = jasmine.createSpy('onCancel')
    const component = renderScreeningInformationForm({onCancel})
    component.find('ActionRow').props().onCancel()
    expect(onCancel).toHaveBeenCalled()
  })

  it('saving changes calls onSave', () => {
    const onSave = jasmine.createSpy('onSave')
    const component = renderScreeningInformationForm({onSave})
    component.find('ActionRow').props().onSave()
    expect(onSave).toHaveBeenCalled()
  })
})

