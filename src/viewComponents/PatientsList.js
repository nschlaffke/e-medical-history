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

    this.retrieveName = this.retrieveName.bind(this)

    this.state = {
      searchedSurname: "",
      showEvents: false,
    };
  }

  componentWillMount() {
    this.fetchPatients();
  }

  fetchPatients() {
    fetch(this.serverUrl + "/Patient/?_format=json")
      .then(blob => blob.json())
      .then(patients => {

        this.allPatients = patients.entry.map((p) => {
          return new Patient(p.resource)
        });
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
      .then(blob => blob.json().entry)
      .then(entries => {
        entries.map((observation) => {
              return new Observation(observation.resource)
        })

        this.allObservations = entries
      })
      .catch(err => console.error(err));
  }

  fetchMedicationStatements(id){
    fetch(this.serverUrl + "/MedicationRequest?patient=" + id + "&_format=json")
      .then(blob => blob.json())
      .then(entries => {

        if(entries != null){
          entries.map((statement) => {
                return new MedicationStatement(statement.resource)
          })

          this.allMedicationStatements = entries
        }
      })
      .catch(err => console.error(err));
  }

  showEvents(id){
    this.fetchObservations(id)
    this.fetchMedicationStatements(id)
    this.setState({ showEvents: true })
  }

  getNameList(surname){
    var nameList = [];
    
    if(surname === ""){
      nameList = this.allPatients.map((patient) => {

        return <PatientName key={ patient.getId() } showEvents={ () => {this.showEvents(patient.getId())} } name={ patient.getName() } surname={ patient.getSurname() } />;
      });
    }

    else {
      for(let patient of this.allPatients){
        if(surname === patient.getSurname()){
          nameList.concat(<PatientName key={ patient.getId() } showEvents={ () => {this.showEvents(patient.getId())} } name={ patient.getName() } surname={ patient.getSurname() } />)
        }
      }
    }

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