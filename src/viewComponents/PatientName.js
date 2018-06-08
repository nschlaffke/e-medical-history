import React, { Component } from 'react';

export class PatientName extends Component {
  
  constructor(props) {
    super(props);
    this.passId = this.passId.bind(this)
  }

  passId(){
    this.props.passId(this.props.iden)
  }
  
  render() {
    return (
      <li onClick={ this.passId }> { this.props.name } { this.props.surname } </li>
    );
  }
}

export default PatientName;