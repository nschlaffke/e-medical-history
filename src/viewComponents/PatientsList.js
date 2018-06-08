import React, { Component } from 'react';
import { Patient } from '../helpers/resourceManager'
import { PatientName } from './PatientName'
import { Filter } from './Filter'
import './PatientsList.css'

export class PatientsList extends Component {
  
  constructor(props) {
    super(props);

    this.serverUrl = "http://localhost:8080/baseDstu3"
    this.allPatients = []

    this.retrieveName = this.retrieveName.bind(this)

    this.state = {
      isFetched: false,
      searchedSurname: ""
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

        this.setState({
          isFetched: true,
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

  getNameList(surname){
    let nameList = this.allPatients
    .filter((patient) => {

      if(this.state.searchedSurname === ""){
        return true;
      }
      else {
        return patient.getSurname() === this.state.searchedSurname;
      }
    }).map((patient) => {

      return <PatientName key={ patient.getId() } name={ patient.getName() } surname={ patient.getSurname() } />;
    });

    return nameList;
  }

  retrieveName(surname){
    this.setState({ searchedSurname: surname });
  }
  
  render() {

    return (
      <div>
        <Filter retrieveName={ this.retrieveName }/>
        <h1> The list of patients: </h1>
        <ol>
          { this.getNameList(this.state.searchedSurname) }
        </ol> 
      </div> 
    );
  }
}

export default PatientsList;