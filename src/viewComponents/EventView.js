import React, { Component } from 'react';

export class EventView extends Component {
  
  constructor(props) {
    super(props);
    this.passDetails = this.passDetails.bind(this)
  }

  passDetails() {
    this.props.passDetails(this.props.details)
  }
  render() {
    return (
      <li onClick={ this.passDetails }> { this.props.date } { this.props.description } </li>
    );
  }
}

export default EventView;