import React, { Component } from 'react';
import EventsDetails from './EventsDetails';
export class EventsList extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      showDetails: false
    }

  }
  
  render() {
    return (
      <div>
         { this.ifShowDetails() }
      </div> 
    ); 
  }

  showDetails() {
    this.setState({ showDetails: true })
  }

  ifShowDetails() {
    if (this.state.showDetails == true) {
      return(
        <EventsDetails/> // TODO tutaj trzeba jakos przekazac event, aby potem wyciagnac z niego detailsy
      )
    }
    else {
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

}
export default EventsList;