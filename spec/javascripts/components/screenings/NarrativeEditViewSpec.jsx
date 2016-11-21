import Immutable from 'immutable'
import NarrativeEditView from 'components/screenings/NarrativeEditView'
import React from 'react'
import {shallow} from 'enzyme'

describe('NarrativeEditView', () => {
  let wrapper
  let onChange
  let onCancel

  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    onCancel = jasmine.createSpy('onCancel')
    const screening = Immutable.fromJS({report_narrative: 'some narrative'})
    wrapper = shallow(
      <NarrativeEditView
        screening={screening}
        onChange={onChange}
        onCancel={onCancel}
      />
    )
  })

  it('renders the narrative card header', () => {
    expect(wrapper.find('#narrative-card .card-header').text()).toEqual('Narrative')
  })

  it('renders the report narrative textarea', () => {
    expect(wrapper.find('textarea').props().value).toEqual('some narrative')
  })

  it('fires the call the onChange function when a field changes', () => {
    wrapper.find('textarea').simulate('change', {target: { value: 'Hey'}})
    expect(onChange).toHaveBeenCalledWith([ 'report_narrative' ], 'Hey')
  })

  xit('renders the save button', () => {
    expect(wrapper.find('.btn.btn-primary').text()).toEqual('Save')
  })

  it('renders the cancel link', () => {
    expect(wrapper.find('.btn.btn-default').text()).toEqual('Cancel')
  })

  it('clicking cancel fires onCancel', () => {
    const cancelButton = wrapper.find('.btn.btn-default')
    cancelButton.simulate('click')
    expect(onCancel).toHaveBeenCalled()
  })
})
