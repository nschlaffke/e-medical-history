import React, { Component } from 'react';

export class Event extends Component {
  
  constructor(props) {
    super(props);

  }
  
  render() {
    return (
      <li onClick={ this.props.showDetails }>EVENT DESCRIPTION</li> // TODO tutaj powinno być wstawione event description i data
    );
  }
}

export default PatientName;