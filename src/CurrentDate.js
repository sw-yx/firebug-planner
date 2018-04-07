import React, { Component } from "react";
import moment from "moment";

export const CurrentDateContext = React.createContext();

const newMoment = moment();
export default class CurrentDateProvider extends Component {
  state = {
    currentDate: newMoment
  };
  handleDateChange = date => {
    this.setState({
      currentDate: date
    });
  };
  setToday = () => {
    this.setState({
      currentDate: newMoment
    });
  };
  render() {
    return (
      <CurrentDateContext.Provider
        value={{
          state: this.state,
          handleDateChange: this.handleDateChange,
          setToday: this.setToday
        }}
      >
        {this.props.children}
      </CurrentDateContext.Provider>
    );
  }
}
