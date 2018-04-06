import React, { Component } from "react";

import TodoList from "./TodoList";
import "./Main.css";

import Calendar from "./Calendar";
import Routine from "./Routine";
class Main extends Component {
  render() {
    return (
      <div className="layout4">
        <div>
          Routines
          <div>
            <div>Monthly Routines</div>
            <Routine isMonthly />
          </div>
          <div>
            <div>Weekly Routines</div>
            <Routine isMonthly={false} />
          </div>
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
          <Calendar />
        </div>
      </div>
    );
  }
}

export default Main;
