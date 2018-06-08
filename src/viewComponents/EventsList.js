import React, { Component } from 'react';

export class EventsList extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isFetched: false
    };
  }
  
  render() {

    return (
      <div>
        <h1> Patient's observations: </h1>
        <ul> { this.props.allObservations } </ul>
        <h1> Medication Statement: </h1>
        <ul> { this.props.allMedicationStatements } </ul>
      </div>
    );
  }
}

export default EventsList;