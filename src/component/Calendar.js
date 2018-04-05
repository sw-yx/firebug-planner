import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CurrentDateContext } from "../CurrentDate";

export default class extends Component {
  render() {
    return (
      <CurrentDateContext>
        {({ state, handleDateChange }) => (
          <DatePicker
            selected={state.currentDate}
            onChange={handleDateChange}
          />
        )}
      </CurrentDateContext>
    );
  }
}
