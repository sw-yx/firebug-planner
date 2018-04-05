import React, { Component } from "react";

import TodoList from "./TodoList";
import "./Main.css";

import Calendar from "./Calendar";
class Main extends Component {
  render() {
    return (
      <div className="layout4">
        <div>Routines</div>
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
