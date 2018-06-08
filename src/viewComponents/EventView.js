import React, { Component } from 'react';

export class EventView extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li> { this.props.date } { this.props.description } {this.props.details} </li>
    );
  }
}

export default EventView;