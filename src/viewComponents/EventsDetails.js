import React, { Component } from 'react';

class EventsDetails extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isFetched: false
    };
  }                                                       
  
  render() {

    return (
        <div>
          <h1>Event details:</h1>
          <div>{ this.props.details }</div> 
        </div>
    );
  }
}

export default EventsDetails;