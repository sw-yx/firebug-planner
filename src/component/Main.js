import React, { Component } from "react";

import TodoList from "./TodoList";
import "./Main.css";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { DateContext } from "../CurrentDate";
import Routine from "./Routine";
class Main extends Component {
  render() {
    return (
      <div className="layout4">
        <div>
          Routines
          <Routine />
        </div>
        <div>
          Notes
          <TodoList />
        </div>
        <div>
          Backlog
          <TodoList isBacklog />
        </div>
        <div>
          Calendar
          <DateContext.Consumer>
            {context => <DatePicker selected={context.state.currentDate} onChange={context.handleDateChange} />}
          </DateContext.Consumer>
        </div>
      </div>
    );
  }
}

export default Main;
