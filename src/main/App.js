import React, { Component } from 'react';
import './App.css';
import { showPatients } from '../helpers/resourceManager'
import { PatientsList } from '../viewComponents/PatientsList'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isFetched: false
    };
  }

  render() {

    showPatients();

    return (
      <div id="root">
        <PatientsList />
      </div>
    );
  }
}

export default App;