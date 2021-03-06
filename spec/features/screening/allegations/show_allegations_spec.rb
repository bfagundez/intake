# frozen_string_literal: true

require 'rails_helper'

feature 'show allegations' do
  scenario 'editing existing allegations' do
    marge = FactoryBot.create(:participant, :perpetrator,
      first_name: 'Marge',
      last_name: 'Simpson',
      date_of_birth: nil)
    lisa = FactoryBot.create(:participant, :victim,
      first_name: 'Lisa',
      last_name: 'Simpsson',
      date_of_birth: nil)
    homer = FactoryBot.create(:participant, :perpetrator,
      first_name: 'Homer',
      last_name: 'Simps',
      date_of_birth: nil)
    allegation = {
      id: '1',
      victim_person_id: lisa.id,
      perpetrator_person_id: marge.id,
      screening_id: '1',
      types: ['General neglect', 'Severe neglect']
    }
    screening = {
      id: '1',
      incident_address: {},
      addresses: [],
      cross_reports: [],
      safety_alerts: [],
      participants: [
        marge.as_json.symbolize_keys,
        homer.as_json.symbolize_keys,
        lisa.as_json.symbolize_keys
      ],
      allegations: [allegation]
    }

    stub_empty_relationships
    stub_empty_history_for_screening(screening)
    stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(screening.to_json, status: 200))
    stub_request(:put, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body({}.to_json, status: 200))

    visit screening_path(id: screening[:id])

    within '.card.show', text: 'Allegations' do
      within 'thead' do
        expect(page).to have_content('Alleged Victim/Children')
        expect(page).to have_content('Alleged Perpetrator')
        expect(page).to have_content('Allegation(s)')
      end

      within 'tbody' do
        expect(page).to_not have_content('Homer')

        table_rows = page.all('tr')

        within table_rows[0] do
          expect(page).to have_content('Marge')
          expect(page).to have_content('Lisa')
          expect(page).to have_content('General neglect')
        end

        within table_rows[1] do
          expect(page).to have_content('Marge')
          expect(page).to have_content('Lisa')
          expect(page).to have_content('Severe neglect')
        end
      end
      click_link 'Edit allegations'
    end

    within '.card.edit', text: 'Allegations' do
      within 'tbody' do
        table_rows = page.all('tr')

        within table_rows[0] do
          expect(page).to have_content('Lisa')
          expect(page).to have_content('Homer')

          select_field_id = "allegations_#{lisa.id}_#{homer.id}"
          expect(page).to have_react_select_field(select_field_id, with: [])
          fill_in_react_select(select_field_id, with: 'Exploitation')
        end

        within table_rows[1] do
          expect(page).to have_no_content('Lisa')
          expect(page).to have_content('Marge')
          expect(page).to have_react_select_field(
            "allegations_#{lisa.id}_#{marge.id}",
            with: ['General neglect', 'Severe neglect']
          )
        end
      end

      click_button 'Save'
    end

    new_allegation = {
      id: nil,
      victim_person_id: lisa.id,
      perpetrator_person_id: homer.id,
      screening_id: screening[:id],
      types: ['Exploitation']
    }

    expect(
      a_request(:put, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .with(body: hash_including(allegations: array_including(new_allegation.as_json)))
    ).to have_been_made
  end

  scenario 'deleting a participant from a screening removes related allegations' do
    marge = FactoryBot.create(:participant, :perpetrator,
      first_name: 'Marge',
      last_name: 'Simpson')
    lisa = FactoryBot.create(:participant, :victim,
      first_name: 'Lisa',
      last_name: 'Simpson')
    homer = FactoryBot.create(:participant, :perpetrator,
      first_name: 'Homer',
      last_name: 'Simpson')
    allegation = {
      id: '1',
      victim_person_id: lisa.id,
      perpetrator_person_id: marge.id,
      screening_id: '1',
      types: ['General neglect']
    }
    screening = {
      id: '1',
      incident_address: {},
      addresses: [],
      cross_reports: [],
      safety_alerts: [],
      participants: [
        marge.as_json.symbolize_keys,
        homer.as_json.symbolize_keys,
        lisa.as_json.symbolize_keys
      ],
      allegations: [allegation]
    }

    stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships
    stub_empty_history_for_screening(screening)

    visit screening_path(id: screening[:id])

    within '.card.show', text: 'Allegations' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
        expect(page).to have_content('General neglect')
      end
    end

    stub_request(:delete,
      ferb_api_url(FerbRoutes.delete_screening_participant_path(screening[:id], marge.id)))
      .and_return(json_body(nil, status: 204))

    screening[:allegations] = []
    screening[:participants] = [lisa.as_json.symbolize_keys, homer.as_json.symbolize_keys]
    stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(screening.to_json, status: 200))

    within show_participant_card_selector(marge.id) do
      click_button 'Remove person'
    end

    within '.card.show', text: 'Allegations' do
      within 'tbody', visible: false do
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('Lisa')
        expect(page).to_not have_content('General neglect')
      end

      click_link 'Edit allegations'
    end

    within '.card.edit', text: 'Allegations' do
      within 'tbody' do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Homer')
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('General neglect')
      end
    end
  end

  scenario 'removing participant role, re-adding it does not show deleted allegations' do
    marge = FactoryBot.create(
      :participant,
      first_name: 'Marge',
      roles: ['Perpetrator', 'Anonymous Reporter']
    )
    lisa = FactoryBot.create(:participant, :victim, first_name: 'Lisa')
    allegation = {
      id: '1',
      victim_person_id: lisa.id,
      perpetrator_person_id: marge.id,
      screening_id: '1',
      types: ['General neglect']
    }
    screening = {
      id: '1',
      incident_address: {},
      addresses: [],
      cross_reports: [],
      safety_alerts: [],
      participants: [marge.as_json.symbolize_keys, lisa.as_json.symbolize_keys],
      allegations: [allegation]
    }
    stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships
    stub_empty_history_for_screening(screening)

    visit screening_path(id: screening[:id])

    within '.card.show', text: 'Allegations' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
        expect(page).to have_content('General neglect')
      end
    end

    within show_participant_card_selector(marge.id) do
      click_link 'Edit person'
    end

    marge.roles = ['Anonymous Reporter']
    stub_request(:put,
      ferb_api_url(FerbRoutes.screening_participant_path(screening[:id], marge.id)))
      .and_return(json_body(marge.to_json, status: 200))

    screening[:allegations] = []
    screening[:participants] = [lisa.as_json.symbolize_keys, marge.as_json.symbolize_keys]
    stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      remove_react_select_option('Role', 'Perpetrator')
      click_button 'Save'
    end

    within '.card.show', text: 'Allegations' do
      within 'tbody', visible: false do
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('Lisa')
        expect(page).to_not have_content('General neglect')
      end
    end

    within show_participant_card_selector(marge.id) do
      click_link 'Edit person'
    end

    marge.roles = ['Anonymous Reporter', 'Perpetrator']
    stub_request(:put,
      ferb_api_url(FerbRoutes.screening_participant_path(screening[:id], marge.id)))
      .and_return(json_body(marge.to_json, status: 200))

    screening[:participants] = [lisa.as_json.symbolize_keys, marge.as_json.symbolize_keys]
    stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      fill_in_react_select('Role', with: 'Perpetrator')
      click_button 'Save'
    end

    within '.card.show', text: 'Allegations' do
      within 'tbody', visible: false do
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('Lisa')
        expect(page).to_not have_content('General neglect')
      end

      click_link 'Edit allegations'
    end

    within '.card.edit', text: 'Allegations' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
        expect(page).to have_react_select_field "allegations_#{lisa.id}_#{marge.id}", with: []
      end
    end
  end

  scenario 'saving another card will not persist changes to allegations' do
    marge = FactoryBot.create(:participant, :perpetrator, first_name: 'Marge')
    lisa = FactoryBot.create(:participant, :victim, first_name: 'Lisa')
    screening = {
      id: '1',
      incident_address: {},
      addresses: [],
      cross_reports: [],
      safety_alerts: [],
      participants: [marge.as_json.symbolize_keys, lisa.as_json.symbolize_keys],
      allegations: []
    }
    stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships
    stub_empty_history_for_screening(screening)

    visit screening_path(id: screening[:id])

    screening[:name] = 'Hello'
    stub_request(:put, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(screening.to_json, status: 200))

    within '.card.show', text: 'Allegations' do
      click_link 'Edit allegations'
    end

    within '.card.edit', text: 'Allegations' do
      fill_in_react_select "allegations_#{lisa.id}_#{marge.id}", with: 'General neglect'
    end

    within '#screening-information-card.card.show' do
      click_link 'Edit screening information'
    end

    within '#screening-information-card.card.edit' do
      fill_in 'Title/Name of Screening', with: 'Hello'
      click_button 'Save'
    end

    expect(
      a_request(:put, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .with(body: hash_including(allegations: []))
    ).to have_been_made
  end

  scenario 'only allegations with allegation types are sent to the API' do
    marge = FactoryBot.create(:participant, :perpetrator,
      first_name: 'Marge',
      last_name: 'Simps',
      date_of_birth: nil)
    lisa = FactoryBot.create(:participant, :victim,
      first_name: 'Lisa',
      last_name: 'Simps',
      date_of_birth: nil)
    homer = FactoryBot.create(:participant, :perpetrator,
      first_name: 'Homer',
      last_name: 'Simps',
      date_of_birth: nil)
    screening = {
      id: '1',
      incident_address: {},
      addresses: [],
      cross_reports: [],
      safety_alerts: [],
      participants: [
        marge.as_json.symbolize_keys,
        homer.as_json.symbolize_keys,
        lisa.as_json.symbolize_keys
      ],
      allegations: []
    }

    stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(screening.to_json, status: 200))
    stub_request(:put, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body({}.to_json, status: 200))
    stub_empty_relationships
    stub_empty_history_for_screening(screening)

    visit screening_path(id: screening[:id])

    within '.card.show', text: 'Allegations' do
      click_link 'Edit allegations'
    end

    within '.card.edit', text: 'Allegations' do
      within 'tbody' do
        table_rows = page.all('tr')

        within table_rows[0] do
          expect(page).to have_content('Lisa')
          expect(page).to have_content('Homer')

          select_field_id = "allegations_#{lisa.id}_#{homer.id}"
          expect(page).to have_react_select_field(select_field_id, with: [])
          fill_in_react_select(select_field_id, with: 'Exploitation')
        end

        within table_rows[1] do
          expect(page).to have_no_content('Lisa')
          expect(page).to have_content('Marge')
          expect(page).to have_react_select_field("allegations_#{lisa.id}_#{marge.id}", with: [])
        end
      end
      click_button 'Save'
    end

    new_allegation = {
      id: nil,
      victim_person_id: lisa.id,
      perpetrator_person_id: homer.id,
      screening_id: screening[:id],
      types: ['Exploitation']
    }

    expect(
      a_request(:put, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .with(body: hash_including(allegations: [new_allegation]))
    ).to have_been_made
  end
end
