import React, { Fragment } from "react";
import { connect } from "react-firebase-firestore";
import { CurrentDateContext } from "../CurrentDate";
import "./Routine.css";

const Minus = () => (
  <svg
    fill="currentColor"
    preserveAspectRatio="xMidYMid meet"
    height="1em"
    width="1em"
    viewBox="0 0 40 40"
    style={{ "vertical-align": "middle" }}
  >
    <g>
      <path d="m28.4 21.6v-3.2h-16.8v3.2h16.8z m3.2-16.6q1.4 0 2.4 1t1 2.4v23.2q0 1.4-1 2.4t-2.4 1h-23.2q-1.4 0-2.4-1t-1-2.4v-23.2q0-1.4 1-2.4t2.4-1h23.2z" />
    </g>
  </svg>
);

const Plus = () => (
  <svg
    fill="currentColor"
    preserveAspectRatio="xMidYMid meet"
    height="1em"
    width="1em"
    viewBox="0 0 40 40"
    style={{ "vertical-align": "middle" }}
  >
    <g>
      <path d="m28.4 21.6v-3.2h-6.8v-6.8h-3.2v6.8h-6.8v3.2h6.8v6.8h3.2v-6.8h6.8z m3.2-16.6c1.8 0 3.4 1.6 3.4 3.4v23.2c0 1.8-1.6 3.4-3.4 3.4h-23.2c-1.9 0-3.4-1.6-3.4-3.4v-23.2c0-1.8 1.5-3.4 3.4-3.4h23.2z" />
    </g>
  </svg>
);

function RoutineItem({ routine, currentPeriod, modifyFrequency, modifyCheckbox }) {
  const checkBoxBoolArray = Array(routine.frequency)
    .fill()
    .map((_, i) => {
      const subselect = routine.completed[currentPeriod] || [];
      const selection = subselect[i];
      return selection === undefined ? false : selection;
    });
  const decreaseFreq = () => modifyFrequency(routine._id, Math.max(1, routine.frequency - 1));
  const increaseFreq = () => modifyFrequency(routine._id, routine.frequency + 1);
  const modCheckbox = idx => {
    const newCompleted = checkBoxBoolArray;
    newCompleted[idx] = !newCompleted[idx];
    modifyCheckbox(routine._id, newCompleted);
  };

  return (
    <div className="RoutineItem">
      <div contentEditable>{routine.title}</div>
      {checkBoxBoolArray.map((bool, idx) => (
        <input key={idx} type="checkbox" checked={bool} onChange={() => modCheckbox(idx)} />
      ))}
      <span onClick={decreaseFreq}>
        <Minus />
      </span>
      <span onClick={increaseFreq}>
        <Plus />
      </span>
    </div>
  );
}

function RoutineList(props) {
  const { collection = [] } = props;
  const handleSubmit = e => {
    e.preventDefault();
    props.addRoutine(e.target.newRoutine.value);
    e.target.newRoutine.value = "";
  };
  return (
    <Fragment>
      {collection.map(routine => <RoutineItem key={routine._id} routine={routine} {...props} />)}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="be productive!" name="newRoutine" />
      </form>
    </Fragment>
  );
}

const mapPropstoFirebase = (props, ref) => ({
  collection: props.collectionName,
  addRoutine: value =>
    ref(props.collectionName).add({
      date: props.currentPeriod,
      title: value,
      frequency: 2,
      completed: {}
    }),
  modifyFrequency: (key, newFrequency) =>
    ref(`${props.collectionName}/${key}`).update({
      frequency: newFrequency
    }),
  modifyCheckbox: (key, newCompleted) =>
    ref(`${props.collectionName}/${key}`).update({
      [`completed.${props.currentPeriod}`]: newCompleted
    })
});

export default props => {
  const HOC = connect(mapPropstoFirebase)(RoutineList);
  const collectionName = props.isMonthly ? "monthlyRoutines" : "weeklyRoutines";
  return (
    <CurrentDateContext>
      {({ state }) => (
        <HOC
          currentPeriod={dateToPeriod(state.currentDate.toDate(), props.isMonthly)}
          collectionName={collectionName}
          {...props}
        />
      )}
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
