import React, { Component } from "react";

import TodoList from "./TodoList";
import "./Main.css";

import Calendar from "./Calendar";
import Routine from "./Routine";
import Button from "./Button";
class Main extends Component {
  render() {
    return (
      <div className="layout4">
        <div className="layout_Panel">
          <h2>Routines</h2>
          <div className="layout_body">
            <h4>Monthly Routines</h4>
            <Routine isMonthly />
            <h4>Weekly Routines</h4>
            <Routine isMonthly={false} />
          </div>
          <div className="layout_footer">
            <Button label="+ Weekly" onClick={() => alert("hi")} />
            <Button label="+ Monthly" onClick={() => alert("hi")} />
          </div>
        </div>
        <div className="layout_Panel">
          <h2>Notes</h2>
          <div className="layout_body">
            <TodoList />
          </div>
          <div className="layout_footer">
            <Button label="+ Todo" onClick={() => alert("hi")} />
            <Button label="+ Note" onClick={() => alert("hi")} />
          </div>
        </div>
        <div className="layout_Panel">
          <h2>Backlog</h2>

          <div className="layout_body">
            <TodoList isBacklog />
          </div>
          <div className="layout_footer">
            <Button label="+ Todo" onClick={() => alert("hi")} />
          </div>
        </div>
        <div className="layout_Panel">
          <h2>Calendar</h2>
          <Calendar />
        </div>
      </div>
    );
  }
}

export default Main;
