# frozen_string_literal: true
require 'rails_helper'

feature 'Edit Person' do
  let(:person) do
    address = FactoryGirl.create(
      :address,
      street_address: '123 fake st',
      city: 'Springfield',
      state: 'NY',
      zip: '12345'
    )
    FactoryGirl.create(
      :person,
      first_name: 'Homer',
      last_name: 'Simpson',
      gender: 'male',
      date_of_birth: '05/29/1990',
      ssn: '123-23-1234',
      address: address
    )
  end

  before do
    stub_request(:get, %r{.*/api/v1/people/#{person.id}})
      .and_return(body: person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
  end

  scenario 'edit and existing person' do
    visit edit_person_path(id: person.id)

    within '.card-header' do
      expect(page).to have_content 'EDIT BASIC DEMOGRAPHICS CARD'
    end

    within '.card-body' do
      expect(page).to have_field('First Name', with: 'Homer')
      expect(page).to have_field('Last Name', with: 'Simpson')
      expect(page).to have_field('Gender', with: 'male')
      expect(page).to have_field('Date of birth', with: '05/29/1990')
      expect(page).to have_field('Social security number', with: '123-23-1234')
      expect(page).to have_field('Address', with: '123 fake st')
      expect(page).to have_field('City', with: 'Springfield')
      expect(page).to have_field('State', with: 'NY')
      expect(page).to have_field('Zip', with: '12345')
    end
    expect(page).to have_link 'Cancel'
    expect(page).to have_button 'Save'
  end

  scenario 'when a user cancels after editing and existing person' do
    visit edit_person_path(id: person.id)

    fill_in 'First Name', with: 'Lisa'
    click_link 'Cancel'

    expect(page).to have_current_path(person_path(id: person.id))
    within '.card-header' do
      expect(page).to have_content('BASIC DEMOGRAPHICS CARD')
    end
    expect(page).to have_content 'Homer'
  end

  scenario 'when a user saves after editing and existing person' do
    visit edit_person_path(id: person.id)

    fill_in 'First Name', with: 'Lisa'

    person.first_name = 'Lisa'

    stub_request(:put, %r{.*/api/v1/people/#{person.id}})
      .with(body: person.to_json)
      .and_return(status: 200,
                  body: person.to_json,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, %r{.*/api/v1/people/#{person.id}})
      .and_return(status: 200,
                  body: person.to_json,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'
    expect(page).to have_current_path(person_path(id: person.id))
    within '.card-header' do
      expect(page).to have_content('BASIC DEMOGRAPHICS CARD')
    end
  end
end
