import React, { Component } from "react";

import moment from "moment";
// first we will make a new context
export const DateContext = React.createContext();

// Then create a provider Component
export default class DateProvider extends Component {
  state = {
    currentDate: moment()
  };
  handleDateChange = date => {
    this.setState({
      currentDate: date
    });
  };
  render() {
    return (
      <DateContext.Provider
        value={{
          state: this.state,
          handleDateChange: this.handleDateChange
        }}
      >
        {this.props.children}
      </DateContext.Provider>
    );
  }
}
