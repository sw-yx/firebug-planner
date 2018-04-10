import React, { Component } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import startOfWeek from "date-fns/start_of_week";
import addWeeks from "date-fns/add_weeks";
import subWeeks from "date-fns/sub_weeks";
import eachDay from "date-fns/each_day";
import isSameDay from "date-fns/is_same_day";
import format from "date-fns/format";
import { CurrentDateContext } from "../CurrentDate";
import "./Calendar.css";
import { connect } from "react-firebase-firestore";

// export default class extends Component {
//   render() {
//     return (
//       <CurrentDateContext>
//         {({ state, handleDateChange }) => <DatePicker selected={state.currentDate} onChange={handleDateChange} />}
//       </CurrentDateContext>
//     );
//   }
// }

const mapPropstoFirebase = (props, ref) => ({
  todos: "todo"
});

export const Calendar2 = props => {
  const HOC = connect(mapPropstoFirebase)(({ todos }) => (
    <CurrentDateContext>
      {({ state, handleDateChange }) => {
        const { currentDate } = state;
        // calculate start of the week from currentDate
        const curWkStart = startOfWeek(currentDate);
        // calculate 4 weeks before
        const startWk = subWeeks(curWkStart, 4);
        // calculate 20 weeks after
        const endWk = addWeeks(curWkStart, 20);
        // generate all dates
        const allDates = eachDay(startWk, endWk);
        return (
          <div className="Calendar">
            {allDates.map(date => {
              // console.log("date", date, " currentDate.toDate()", currentDate.toDate());
              const activeClass = isSameDay(date, currentDate) && "active";
              const hasDot = isDateInTodos(todos, date);
              return (
                <div key={date} className={`Calendar-cell ${activeClass}`} onClick={() => handleDateChange(date)}>
                  {date.getDate() === 1 && <span className="Calendar-month">{format(date, "MMM")}</span>}
                  {(date.getDate() + "").padStart(2, "0")}
                  {hasDot && <div className="Calendar-cell-dotted" />}
                </div>
              );
            })}
          </div>
        );
      }}
    </CurrentDateContext>
  ));
  return <CurrentDateContext>{({ state }) => <HOC currentDate={state.currentDate} {...props} />}</CurrentDateContext>;
};

function isDateInTodos(todos, date) {
  return todos && todos.some(todo => isSameDay(todo.date, date));
}
