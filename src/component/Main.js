import React, { Component } from "react";
import { connect } from "react-firebase-firestore";
import { CurrentDateContext } from "../CurrentDate";

import TodoList from "./TodoList";
import "./Main.css";

import Calendar from "./Calendar";
import Routine from "./Routine";
import Button from "./Button";
class Main extends Component {
  render() {
    const { addRoutine, addNote, addTodo, addBacklogTodo } = this.props;
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
            <Button label="+ Weekly" onClick={() => addRoutine("weeklyRoutines")} />
            <Button label="+ Monthly" onClick={() => addRoutine("monthlyRoutines")} />
          </div>
        </div>
        <div className="layout_Panel">
          <h2>Notes</h2>
          <div className="layout_body">
            <TodoList />
          </div>
          <div className="layout_footer">
            <Button label="+ Todo" onClick={() => addTodo("")} />
            <Button label="+ Note" onClick={() => addNote("")} />
          </div>
        </div>
        <div className="layout_Panel">
          <h2>Backlog</h2>

          <div className="layout_body">
            <TodoList isBacklog />
          </div>
          <div className="layout_footer">
            <Button label="+ Todo" onClick={() => addBacklogTodo("")} />
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

const mapPropstoFirebase = (props, ref) => ({
  addRoutine: collectionName =>
    ref(collectionName)
      .add({
        date: new Date(),
        title: "",
        frequency: 2,
        completed: {}
      })
      .then(function(docRef) {
        return docRef.id;
      }),
  addNote: value =>
    ref("todo").add({
      dateCreated: new Date(),
      date: props.currentDate.toDate(),
      text: value,
      isComplete: false,
      isNote: true
    }),
  addTodo: value =>
    ref("todo").add({
      dateCreated: new Date(),
      date: props.currentDate.toDate(),
      text: value,
      isComplete: false,
      isNote: false
    }),
  addBacklogTodo: value =>
    ref("todo").add({
      dateCreated: new Date(),
      date: null,
      text: value,
      isComplete: false,
      isNote: false
    })
});

export default props => {
  const HOC = connect(mapPropstoFirebase)(Main);
  return (
    <CurrentDateContext>
      {({ state }) => {
        return <HOC currentDate={state.currentDate} {...props} />;
      }}
    </CurrentDateContext>
  );
};
