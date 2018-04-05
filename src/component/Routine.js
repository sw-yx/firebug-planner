import React, { Component } from "react";

import { connect } from "react-firebase-firestore";

import { DateContext } from "../CurrentDate";
// function compareDates(a, b) {
//   return a && a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
// }

class RoutineItem extends Component {
  render() {
    const { completedRoutines = [], routine, currentMonth, completeRoutine } = this.props;
    const relevantRoutines = completedRoutines.filter(completedRoutine => {
      return completedRoutine.month === currentMonth;
    });
    return (
      <div>
        {relevantRoutines.map(relevantRoutine => (
          <div key={relevantRoutine._id}>
            {routine.numslots}
            <input type="checkbox" checked={false} onChange={() => completeRoutine(routine._id)} />
            <button onClick={() => alert("+1 to routine number")}>completeroutine</button>
          </div>
        ))}
      </div>
    );
  }
}

class Routine extends Component {
  render() {
    const { routines = [], addRoutine } = this.props;
    return (
      <div>
        <div>{routines.map(routine => <RoutineItem key={routine._id} routine={routine} {...this.props} />)}</div>
        <button onClick={() => addRoutine("second")}>addRoutine</button>
      </div>
    );
  }
}

const mapPropstoFirebase = (props, ref) => ({
  routines: "monthlyRoutines",
  addRoutine: name =>
    ref(`monthlyRoutines`).add({
      name: name,
      numslots: 2
    }),
  completedRoutines: "monthlyRoutinesCompletions",
  completeRoutine: key =>
    ref(`monthlyRoutinesCompletions`).add({
      key,
      month: dateToMonth(props.currentDate.toDate()),
      completions: true
    })
});

export default props => (
  <DateContext.Consumer>
    {context => {
      const { currentDate } = context.state;
      const currentMonth = dateToMonth(currentDate);
      const RoutineContainer = connect(mapPropstoFirebase)(Routine);
      return <RoutineContainer currentMonth={currentMonth} {...props} />;
    }}
  </DateContext.Consumer>
);

function dateToMonth(date) {
  return date.toISOString().slice(0, 7);
}
