import React, { Component } from 'react';
import { MedicationStatement, Observation } from '../helpers/resourceManager'
import { EventView } from './EventView'

export class EventsList extends Component {
  
  constructor(props) {
    super(props);

    this.allObservations = []
    this.allMedicationStatements = []

    this.state = {
      stat: false,
      obs: false
    };

    this.handleGoBack = this.handleGoBack.bind(this)
  
    this.fetchObservations()
    this.fetchMedicationStatements()
  }

  fetchObservations(){
    fetch(this.props.serverUrl + "/Observation?patient=" + this.props.iden + "&_sort=date&_format=json")
      .then(blob => blob.json())
      .then(observations => {
        this.allObservations = observations.entry.map((observation) => {
          return new Observation(observation.resource)
        })
        this.setState({ obs: true})
      })
      .catch(err => console.error(err));
  }

  fetchMedicationStatements(){
    fetch(this.props.serverUrl + "/MedicationRequest?patient=" + this.props.iden + "&_format=json")
      .then(blob => blob.json())
      .then(statements => {
        if(statements != null){
          this.allMedicationStatements = statements.entry.map((statement) => {
            return new MedicationStatement(statement.resource)
          })
          this.setState({ stat: true})
        }
      })
      .catch(err => console.error(err));
  }

  handleGoBack(event) {
    event.preventDefault();
    window.location.reload(true);
  }

  render() {
    const observationList = this.allObservations.map((statement, index, array) => {
        return <EventView key={ index } date={ statement.date } description={ statement.description } details={ statement.details } />;
      });

    const medicationStatementsList = this.allMedicationStatements.map((statement, index, array) => {
        return <EventView key={ index + observationList.length } date={ statement.date } description={ statement.description } details={ statement.details } />;
      });

    const all = observationList.concat(medicationStatementsList)

    all.sort((a, b) => {
        let aDate = new Date(a.props.date);
        let bDate = new Date(b.props.date);

        if (aDate > bDate) {
            return 1;
        }
        else {
            return -1;
        }
    })

    return (
        <div>
        <h1> Patient's events: </h1>
        <ul> { all } </ul>
        <button type="button" onClick={ this.handleGoBack }>Go Back</button> 
        </div>
    );
  }
}

export default EventsList;