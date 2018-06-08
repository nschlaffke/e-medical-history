import React, { Component } from 'react';
import { Patient, MedicationStatement, Observation } from '../helpers/resourceManager'
import { PatientName } from './PatientName'
import { Filter } from './Filter'
import { EventsList } from './EventsList'
import './PatientsList.css'

export class PatientsList extends Component {
  
  constructor(props) {
    super(props);

    this.serverUrl = "http://localhost:8080/baseDstu3"
    this.allPatients = []
    this.allObservations = []
    this.allMedicationStatements = []

    this.state = {
      isFetched: false,
      observations: false,
      statemetns: false,
      searchedSurname: "",
      showEvents: false,
    };

    this.fetchPatients();

    this.retrieveName = this.retrieveName.bind(this)
  }

  fetchPatients() {
    
    fetch(this.serverUrl + "/Patient/?_format=json")
      .then(blob => blob.json())
      .then(patients => {

        this.allPatients = patients.entry.map((p) => {
          return new Patient(p.resource)
        });

        this.setState({ isFetched: true })
      })
      .catch(err => console.error(err));
  }

  findPatientBySurname(surname){
    for (let patient of this.allPatients){
      if(patient.getSurname() === surname){
        return patient; 
      }
    }
  }

  retrieveName(surname){
    this.setState({ searchedSurname: surname });
  }

  fetchObservations(id){
    fetch(this.serverUrl + "/Observation?patient=" + id + "&_sort=date&_format=json")
      .then(blob => blob.json())
      .then(obserations => {
        this.allObservations = obserations.entry.map((observation) => {
          return new Observation(observation.resource)
        })
      })
      .catch(err => console.error(err));
  }

  fetchMedicationStatements(id){
    fetch(this.serverUrl + "/MedicationRequest?patient=" + id + "&_format=json")
      .then(blob => blob.json())
      .then(statements => {
        if(statements != null){
          this.allMedicationStatements = statements.entry.map((statement) => {
            return new MedicationStatement(statement.resource)
          })
          console.log(this.allMedicationStatements)
        }
      })
      .catch(err => console.error(err));

      console.log(this.serverUrl)
  }

  showEvents(id){
    this.fetchObservations.call(this, id)
    this.fetchMedicationStatements.call(this, id)
    this.setState({ showEvents: true })
    console.log(this.allObservations)
    console.log(this.allMedicationStatements)
  }

  getNameList(surname){
    var nameList = [];
    nameList = this.allPatients.filter((patient, index, array) => {
      if(surname === ""){
        return true
      }
      else {
        return surname === patient.getSurname()
      }
    })
    .map((patient) => {

      return <PatientName key={ patient.getId() } showEvents={ () => {this.showEvents.call(this, patient.getId())} } name={ patient.getName() } surname={ patient.getSurname() } />;
    });

    return nameList;
  }

  ifShowEvents(surname){
    if(this.state.showEvents === true){
      return (
        <EventsList allObservations={ this.allObservations } allMedicationStatements={ this.allMedicationStatements }/>
      );
    }
    else {
      return (
        <div>
          <h1> The list of patients: </h1>
          <ol>
            { this.getNameList(surname) }
          </ol>
        </div>
      );
    }
  }
  
  render() {
    return (
      <div>
        <Filter retrieveName={ this.retrieveName }/>
         { this.ifShowEvents(this.state.searchedSurname) }
      </div> 
    );
  }
}

export default PatientsList;