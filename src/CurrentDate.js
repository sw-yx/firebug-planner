import React, { Component } from "react";
import moment from "moment";

export const CurrentDateContext = React.createContext();

export default class CurrentDateProvider extends Component {
  state = {
    currentDate: moment(),
    currentFocus: null
  };
  handleDateChange = date => {
    this.setState({
      currentDate: date
    });
  };
  setFocus = key => this.setState({ currentFocus: key });
  render() {
    return (
      <CurrentDateContext.Provider
        value={{
          state: this.state,
          handleDateChange: this.handleDateChange,
          setCurrentFocus: this.setFocus
        }}
      >
        {this.props.children}
      </CurrentDateContext.Provider>
    );
  }
}
