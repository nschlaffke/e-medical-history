import React, { Component } from 'react';
import './Filter.css'

export class Filter extends Component {
  
  constructor(props) {
    super(props);

    this.saveName = this.saveName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
        name: ""
    }
  }

  saveName(event){
      this.setState({ name: event.target.value });
      if (event.target.value === ""){
        this.props.retrieveName(event.target.value)
      }
  }

  handleSubmit(event){
    this.props.retrieveName(this.state.name)
    event.preventDefault();
  }
  
  render() {
    return (
      <form id="nameForm">
          <input className="formElement" type="text" name="name" placeholder="Patient's surname" onChange={ this.saveName }/>
          <input className="formElement" type="submit" value="Submit" onClick={ this.handleSubmit }/>
      </form>
    );
  }
}

export default Filter;