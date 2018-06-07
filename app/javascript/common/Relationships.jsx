import PropTypes from 'prop-types'
import React from 'react'
import RelationCard from './RelationCard'

const attachLink = (onClick, relationship, maybeId) => (
  <a className='hidden-print' onClick = {() => { onClick(relationship, maybeId) }}>&nbsp;Attach</a>
)

const isPending = (relationship, pendingPeople) =>
  pendingPeople.some((id) => id === (relationship.legacy_descriptor && relationship.legacy_descriptor.legacy_id))

export const Relationships = ({people, onClick, screeningId, isScreening, pendingPeople = []}) => (

  <div className='card-body no-pad-top'>
    {
      isScreening && people.map((person, index) => (
        <div className='row' key={`new-${index}`}>
          <div className='col-md-12'>
            {
              (person.relationships.length > 0) &&
              <span>
                <RelationCard firstName={person.name} data={person.relationships}
                  attachActions={(cell, row) => (
                    (row.person_card_exists && !isPending(row, pendingPeople)) ? //eslint-disable-line no-nested-ternary
                    (isScreening ? attachLink(onClick, row, screeningId) : attachLink(onClick, row)) : '')} //eslint-disable-line no-nested-ternary
                />
              </span>
            }
            {
              (person.relationships.length === 0) &&
              <span className='relationships'><strong>&nbsp;&nbsp;&nbsp;&nbsp;{person.name}</strong> has no known relationships</span>
            }
          </div>
        </div>
      ))
    }
  </div>
)

Relationships.propTypes = {
  isScreening: PropTypes.bool,
  onClick: PropTypes.func,
  pendingPeople: PropTypes.arrayOf(PropTypes.string),
  people: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    relationships: PropTypes.arrayOf(PropTypes.shape({
      relatee: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      secondaryRelationship: PropTypes.string,
    })),
  })),
  screeningId: PropTypes.string,
}

export const EmptyRelationships = () => (
  <div className='card-body no-pad-top'>
    <div className='row'>
      <div className='col-md-12 empty-relationships'>
        <div className='double-gap-top  centered'>
          <span className='c-dark-grey'>Search for people and add them to see their relationships.</span>
        </div>
      </div>
    </div>
  </div>
)
