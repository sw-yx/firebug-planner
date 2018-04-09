import React, { PureComponent } from "react";
import { AppState } from "./AppState";
import Link from "react-router-dom/Link";
import * as Theme from "./theme";
import format from "date-fns/format";
import startOfWeek from "date-fns/start_of_week";
import addDays from "date-fns/add_days";
import addWeeks from "date-fns/add_weeks";
import subWeeks from "date-fns/sub_weeks";
import isFirstDayOfMonth from "date-fns/is_first_day_of_month";
import getDayOfYear from "date-fns/get_day_of_year";
import isToday from "date-fns/is_today";
import parse from "date-fns/parse";

const getWeeks = date => {
  let thisWeek = startOfWeek(date);
  let firstOfYearIsh = subWeeks(thisWeek, 4);
  let weeks = Array.from({ length: 24 }).map((_, i) => {
    let day = addWeeks(firstOfYearIsh, i);
    return Array.from({ length: 7 }).map((_, i) => addDays(day, i));
  });
  return weeks;
};

class CalendarLink extends PureComponent {
  render() {
    const { dayKey, day, isCurrent, isToday, isFirstDay, hasIncompleteTodos } = this.props;
    return (
      <Link
        to={`/${dayKey}`}
        css={{
          borderRadius: "3px",
          textDecoration: "none",
          ":hover": {
            textDecoration: "underline"
          },
          textAlign: "center",
          position: "relative",
          width: "3em",
          height: "2.8em",
          lineHeight: "2.8em",
          margin: "0.3em",
          color: isCurrent ? Theme.lightest : isToday ? Theme.darkest : "#aaa",
          backgroundColor: isCurrent ? Theme.activeBackground : isToday ? "#eee" : undefined,
          fontWeight: isToday ? "bold" : undefined,
          ":before": {
            top: "-1.1em",
            left: "0",
            right: "0",
            textAlign: "center",
            fontSize: "80%",
            position: "absolute",
            textTransform: "uppercase",
            fontWeight: "bold",
            color: Theme.darkest,
            content: isFirstDay || isFirstDayOfMonth(day) ? format(day, "MMM") : undefined
          },
          ":after": {
            top: "-.25em",
            left: "-0.9em",
            width: "1em",
            overflowWrap: "break-word",
            fontSize: "50%",
            lineHeight: 1,
            position: "absolute",
            textTransform: "uppercase",
            fontWeight: "bold",
            color: Theme.activeBackground,
            content: getDayOfYear(day) === 1 ? format(day, "YYYY") : undefined
          }
        }}
      >
        {format(day, "DD")}
        {hasIncompleteTodos && (
          <div
            css={{
              background: "red",
              height: "0.5em",
              width: "0.5em",
              borderRadius: "50%",
              position: "absolute",
              bottom: "0.25em",
              left: "1.25em"
            }}
          />
        )}
      </Link>
    );
  }
}

class Calendar extends PureComponent {
  state = {
    weeks: getWeeks(parse(this.props.dayKey))
  };

  componentDidMount() {
    let hour = 1000 * 60 * 60;
    setInterval(() => {
      this.setState({ weeks: getWeeks(new Date()) });
    }, hour);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dayKey !== this.props.dayKey) {
      this.setState({
        weeks: getWeeks(parse(nextProps.dayKey))
      });
    }
  }

  render() {
    let { dayKey, state } = this.props;
    let { weeks } = this.state;
    let todayKey = format(new Date(), "YYYY-MM-DD");
    return (
      <div css={{ display: "flex", flexDirection: "column" }}>
        <div css={{ display: "flex", alignItems: "center" }}>
          <div css={{ flex: 1 }} />
          <h2>Calendar</h2>
          <div
            css={{
              flex: 1,
              textAlign: "right",
              padding: "10px",
              fontSize: "80%"
            }}
          >
            {todayKey !== dayKey && (
              <Link style={{ color: "inherit" }} to={`/${todayKey}`}>
                Today
              </Link>
            )}
          </div>
        </div>
        <div css={{ flex: 1, overflow: "hidden", padding: "0 0.5em" }}>
          {weeks.map((week, index) => (
            <div key={index} css={{ display: "flex", fontSize: "80%" }}>
              {week.map((day, dayIndex) => {
                let thisDayKey = format(day, "YYYY-MM-DD");
                return (
                  <CalendarLink
                    key={dayIndex}
                    isFirstDay={index === 0 && dayIndex === 0}
                    day={day}
                    dayKey={thisDayKey}
                    isToday={isToday(day)}
                    isCurrent={thisDayKey === dayKey}
                    hasIncompleteTodos={
                      !!state.logs.find(note => note.day === thisDayKey && note.todo && note.completed === false)
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default props => <AppState>{({ value: state }) => <Calendar {...props} state={state} />}</AppState>;
