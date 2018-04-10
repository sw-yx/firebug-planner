import React, { Component } from "react";
import { CurrentDateContext } from "../CurrentDate";
import startOfWeek from "date-fns/start_of_week";
import subWeeks from "date-fns/sub_weeks";
import addWeeks from "date-fns/add_weeks";
import eachDay from "date-fns/each_day";
import format from "date-fns/format";
import isSameDay from "date-fns/is_same_day";
import getDate from "date-fns/get_date";
import { connect } from "react-firebase-firestore";

import "./Calendar.css";

class Calendar extends Component {
  render() {
    const { todos, handleDateChange, currentDate } = this.props;
    // calculate start of week
    const curWk = startOfWeek(currentDate);
    // calculate 4 weeks before
    const beginWk = subWeeks(curWk, 4);
    // calculate 20 week before
    const endWk = addWeeks(curWk, 20);
    // generate date range
    const dateRange = eachDay(beginWk, endWk);
    return (
      <div className="Calendar">
        {dateRange.map(date => {
          // console.log("date", date, "currentDate", currentDate);
          const activeClass =
            isSameDay(date, currentDate) && "Calendar-cell-active";
          const hasDot = containsTodo(todos, date);
          const hasMonth = getDate(date) === 1 && format(date, "MMM");
          return (
            <div
              key={date}
              className={`Calendar-cell ${activeClass}`}
              onClick={() => handleDateChange(date)}
            >
              {hasMonth && (
                <div className="Calendar-cell-month">{hasMonth}</div>
              )}
              {format(date, "DD")}
              {hasDot && <div className="Calendar-cell-dotted" />}
            </div>
          );
        })}
      </div>
    );
  }
}

const mapPropstoFirebase = (props, ref) => ({
  todos: "todo"
});
export default props => {
  const HOC = connect(mapPropstoFirebase)(Calendar);
  return (
    <CurrentDateContext>
      {({ state, handleDateChange }) => (
        <HOC
          currentDate={state.currentDate}
          handleDateChange={handleDateChange}
          {...props}
        />
      )}
    </CurrentDateContext>
  );
};

function containsTodo(todos, date) {
  return todos && todos.some(todo => isSameDay(todo.date, date));
}
