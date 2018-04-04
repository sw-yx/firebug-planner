import React, { Component } from "react";

import TodoList from "./TodoList";
import "./Main.css";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
class Main extends Component {
  render() {
    const { currentDate, handleDateChange } = this.props;
    return (
      <div className="layout4">
        <div>Routines</div>
        <div>
          Notes
          <TodoList currentDate={currentDate} />
        </div>
        <div>
          Backlog
          <TodoList currentDate={currentDate} isBacklog />
        </div>
        <div>
          Calendar<DatePicker
            selected={currentDate}
            onChange={handleDateChange}
          />
        </div>
      </div>
    );
  }
}

export default Main;
