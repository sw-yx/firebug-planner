import React from "react";
import { connect } from "react-firebase-firestore";
import { CurrentDateContext } from "../CurrentDate";

function RoutineItem({
  routine,
  currentPeriod,
  modifyFrequency,
  modifyCheckbox
}) {
  const checkBoxBoolArray = Array(routine.frequency)
    .fill()
    .map((_, i) => {
      const subselect = routine.completed[currentPeriod] || [];
      const selection = subselect[i];
      return selection === undefined ? false : selection;
    });
  const decreaseFreq = () =>
    modifyFrequency(routine._id, Math.max(1, routine.frequency - 1));
  const increaseFreq = () =>
    modifyFrequency(routine._id, routine.frequency + 1);
  const modCheckbox = idx => {
    const newCompleted = checkBoxBoolArray;
    newCompleted[idx] = !newCompleted[idx];
    modifyCheckbox(routine._id, newCompleted);
  };

  return (
    <div>
      {routine.title}
      {checkBoxBoolArray.map((bool, idx) => (
        <input
          key={idx}
          type="checkbox"
          checked={bool}
          onChange={() => modCheckbox(idx)}
        />
      ))}
      <button onClick={decreaseFreq}>-</button>
      <button onClick={increaseFreq}>+</button>
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
    <div>
      {collection.map(routine => (
        <RoutineItem key={routine._id} routine={routine} {...props} />
      ))}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="be productive!" name="newRoutine" />
      </form>
    </div>
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
          currentPeriod={dateToPeriod(
            state.currentDate.toDate(),
            props.isMonthly
          )}
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
