import React, { Component } from "react";

import { CurrentDateContext } from "../CurrentDate";
import { connect } from "react-firebase-firestore";

class Routine extends Component {
  checkCheckBox = (key, checkBoxData, idx) => {
    checkBoxData[idx] = !checkBoxData[idx];
    this.props.checkPeriodRoutines(key, checkBoxData);
  };
  modifyRoutine = (key, currentFrequency, isAdd) => {
    this.props.changePeriodRoutineFrequency(key, currentFrequency + (isAdd ? 1 : -1));
  };
  render() {
    const { routine, currentPeriod } = this.props;
    const currentPeriodCompleted = routine.completed[currentPeriod] || Array(routine.frequency).fill(false);
    const checkBoxData = Array(routine.frequency)
      .fill()
      .map((_, i) => {
        if (i + 1 > currentPeriodCompleted.length) {
          // i have no data
          return false;
        } else {
          return currentPeriodCompleted[i] === undefined ? false : currentPeriodCompleted[i];
        }
      }); // just an array of true and false correctly adjusted for routine.frequency
    return (
      <div>
        {routine.title}
        {checkBoxData.map((val, idx) => (
          <input
            key={idx}
            type="checkbox"
            checked={val}
            onChange={() => this.checkCheckBox(routine._id, checkBoxData, idx)}
          />
        ))}
        <button onClick={() => this.modifyRoutine(routine._id, routine.frequency, false)}>-</button>
        <button onClick={() => this.modifyRoutine(routine._id, routine.frequency, true)}>+</button>
      </div>
    );
  }
}

class RoutineList extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.addPeriodRoutines(e.target.newRoutine.value);
    e.target.newRoutine.value = "";
  };
  render() {
    const { periodRoutines = [] } = this.props;
    return (
      <div>
        {periodRoutines.map(mr => <Routine key={mr._id} routine={mr} {...this.props} />)}

        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="be productive!" name="newRoutine" />
        </form>
      </div>
    );
  }
}

const mapPropstoFirebase = (props, ref) => {
  const periodRoutines = props.isMonthly ? "monthlyRoutines" : "weeklyRoutines";
  // console.log("props.isMonthly", props.isMonthly);
  // console.log("props.currentPeriod", props.currentPeriod);
  return {
    periodRoutines: periodRoutines,
    addPeriodRoutines: value =>
      ref(periodRoutines).add({
        // first thing you see when you add a new routine
        date: props.currentPeriod,
        title: value,
        frequency: 2,
        completed: {
          [props.currentPeriod]: [false, false]
        }
      }),
    checkPeriodRoutines: (key, newCompleted) =>
      ref(`${periodRoutines}/${key}`).update({
        [`completed.${props.currentPeriod}`]: newCompleted
      }),
    changePeriodRoutineFrequency: (key, newFrequency) =>
      ref(`${periodRoutines}/${key}`).update({
        frequency: newFrequency
      })
  };
};

export default props => {
  const HOC = connect(mapPropstoFirebase)(RoutineList);
  return (
    <CurrentDateContext>
      {({ state }) => <HOC currentPeriod={dateToPeriod(state.currentDate.toDate(), props.isMonthly)} {...props} />}
    </CurrentDateContext>
  );
};

function dateToPeriod(date, isMonthly) {
  return isMonthly ? date.toISOString().slice(0, 7) : getWeekNumber(date);
}

// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return "" + d.getUTCFullYear() + weekNo;
}
