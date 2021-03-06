import React from 'react'
import {shallow} from 'enzyme'
import AllegationsForm from 'views/AllegationsForm'

describe('AllegationsForm', () => {
  const renderAllegationsForm = ({allegations = [], onCancel = () => {}, onSave = () => {}, ...args}) => {
    const props = {allegations, onCancel, onSave, ...args}
    return shallow(<AllegationsForm {...props}/>, {disableLifecycleMethods: true})
  }

  it('renders a card action row', () => {
    const component = renderAllegationsForm({})
    expect(component.find('ActionRow').exists()).toEqual(true)
    expect(component.find('ActionRow').props().isSaving).not.toBeTruthy()
  })

  it('passes isSaving through to ActionRow', () => {
    const component = renderAllegationsForm({isSaving: true})
    expect(component.find('ActionRow').props().isSaving).toEqual(true)
  })

  it('canceling edit calls onCancel', () => {
    const onCancel = jasmine.createSpy('onCancel')
    const component = renderAllegationsForm({onCancel})
    component.find('ActionRow').props().onCancel()
    expect(onCancel).toHaveBeenCalled()
  })

  it('saving changes calls onSave', () => {
    const onSave = jasmine.createSpy('onSave')
    const component = renderAllegationsForm({onSave})
    component.find('ActionRow').props().onSave()
    expect(onSave).toHaveBeenCalled()
  })

  it('displays an alert error message if one is passed', () => {
    const alertErrorMessage = 'Something is wrong!'
    const component = renderAllegationsForm({alertErrorMessage})
    expect(component.find('AlertErrorMessage').exists()).toEqual(true)
    expect(component.find('AlertErrorMessage').props().message).toEqual(alertErrorMessage)
  })

  it('does not render an alert error message if none is passed', () => {
    const component = renderAllegationsForm({})
    expect(component.find('AlertErrorMessage').exists()).toEqual(false)
  })

  it('renders column headings for the table', () => {
    const component = renderAllegationsForm({})
    expect(component.find('th').at(0).text()).toEqual('Alleged Victim/Children')
    expect(component.find('th').at(1).text()).toEqual('Alleged Perpetrator')
    expect(component.find('th').at(2).text()).toEqual('Allegation(s)')
  })

  it('renders "required" if allegations are required', () => {
    const component = renderAllegationsForm({required: true})
    expect(component.find('th').at(2).text()).toEqual('Allegation(s) (Required)')
  })

  it('renders the victim name for an allegation in the first column', () => {
    const allegations = [{victimName: 'John Smith', allegationTypes: []}]
    const component = renderAllegationsForm({allegations})
    expect(component.find('tbody tr td').at(0).text()).toEqual('John Smith')
  })

  it('renders the perpetrator name for an allegation in the second column', () => {
    const allegations = [{perpetratorName: 'John Smith', allegationTypes: []}]
    const component = renderAllegationsForm({allegations})
    expect(component.find('tbody tr td').at(1).text()).toEqual('John Smith')
  })

  describe('allegationTypes multiselect', () => {
    const allegationTypes = [
      {value: '123', label: 'General neglect'},
      {value: 'ABC', label: 'Physical abuse'},
    ]
    const allegations = [{
      victimName: 'John Smith',
      victimId: 'XYZ',
      perpetratorName: 'Jane Doe',
      perpetratorId: '789',
      allegationTypes: ['123', 'ABC'],
    }]

    it('renders a multiselect for each allegation with the passed allegation types', () => {
      const component = renderAllegationsForm({allegations, allegationTypes})
      const allegationTypesSelect = component.find('Select')
      expect(allegationTypesSelect.exists()).toEqual(true)
      expect(allegationTypesSelect.props().options).toEqual([
        {value: '123', label: 'General neglect'},
        {value: 'ABC', label: 'Physical abuse'},
      ])
    })

    it('properly sets the default props for the multiselect', () => {
      const component = renderAllegationsForm({allegations, allegationTypes})
      const allegationTypesSelect = component.find('Select')
      expect(allegationTypesSelect.props().multi).toEqual(true)
      expect(allegationTypesSelect.props().tabSelectsValue).toEqual(false)
      expect(allegationTypesSelect.props().clearable).toEqual(false)
      expect(allegationTypesSelect.props().placeholder).toEqual('')
    })

    it('sets accessibility properties, including aria-label and css id', () => {
      const component = renderAllegationsForm({allegations, allegationTypes})
      const allegationTypesSelect = component.find('Select')
      expect(allegationTypesSelect.props()['aria-label']).toEqual('allegations John Smith Jane Doe')
      expect(allegationTypesSelect.props().inputProps).toEqual({id: 'allegations_XYZ_789'})
    })

    it('passes the selected values for the allegation to the multiselect', () => {
      const component = renderAllegationsForm({allegations, allegationTypes})
      const allegationTypesSelect = component.find('Select')
      expect(allegationTypesSelect.props().value).toEqual([
        {value: '123', label: '123'},
        {value: 'ABC', label: 'ABC'},
      ])
    })

    it('when changed, calls onChange with the victim id, perpetrator id, and selected values', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderAllegationsForm({allegations, allegationTypes, onChange})
      const allegationTypesSelect = component.find('Select')
      allegationTypesSelect.simulate('change', [{value: '123', label: 'General neglect'}])
      expect(onChange).toHaveBeenCalledWith({victimId: 'XYZ', perpetratorId: '789', allegationTypes: ['123']})
    })
  })
})
