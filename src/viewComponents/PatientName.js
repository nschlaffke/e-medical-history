import React, { Component } from 'react';

export class PatientName extends Component {
  
  constructor(props) {
    super(props);

  }
  
  render() {
    return (
      <li onClick={ this.props.showEvents }> { this.props.name } { this.props.surname } </li>
    );
  }
}

export default PatientName;