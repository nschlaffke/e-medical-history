import React, { Component } from 'react';
import { Patient } from '../helpers/resourceManager'
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
      searchedSurname: "",
      showEvents: false,
      iden: -1,
    };

    this.fetchPatients();

    this.retrieveName = this.retrieveName.bind(this)
    this.passId = this.passId.bind(this)
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

  passId(id){
    this.setState({iden: id})
    this.setState({showEvents: true})
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
    .map((patient, index, array) => {
      return <PatientName key={ index } iden={ patient.getId() } passId={ this.passId } name={ patient.getName() } surname={ patient.getSurname() } />;
    });

    return nameList;
  }

  ifShowEvents(surname){
    if(this.state.showEvents === true){
      return (
        <EventsList serverUrl={ this.serverUrl } iden={ this.state.iden } />
      );
    }
    else {
      return (
        <div>
          <Filter retrieveName={ this.retrieveName }/>
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
         { this.ifShowEvents(this.state.searchedSurname) }
      </div> 
    );
  }
}

export default PatientsList;