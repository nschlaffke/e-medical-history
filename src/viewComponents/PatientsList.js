import React, { Component } from 'react';
import { Patient } from '../helpers/resourceManager'
import { PatientName } from './PatientName'

export class PatientsList extends Component {
  
  constructor(props) {
    super(props);

    this.serverUrl = "http://localhost:8080/baseDstu3"
    this.allPatients = []

    this.state = {
      isFetched: false
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

  getNameList(){
    let nameList = this.allPatients.map((p) => {
          return <PatientName name={ p.getName() } surname={ p.getSurname() } />;
      });

    return nameList;
  }
  
  render() {

    return (
      <ol>
        { this.getNameList() }
      </ol>  
    );
  }
}

export default PatientsList;