import React, { Component } from "react";

import { connect } from "react-firebase-firestore";

import { CurrentDateContext } from "../CurrentDate";
import ContentEditable from "react-contenteditable";

import "./TodoList.css";
function compareDates(a, b) {
  return a && a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

class TodoList extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.addTodo(e.target.newTodo.value);
    e.target.newTodo.value = "";
  };
  render() {
    const {
      value,
      todos,
      currentDate,
      isBacklog,
      addTodo,
      addNote,
      deleteTodo,
      toggleBacklog,
      editTitle,
      checkItem
    } = this.props;

    const handleKeyDown = todo => e => {
      if (e.keyCode === 13 && e.metaKey && e.shiftKey && !isBacklog) {
        addNote("");
      } else if (e.keyCode === 13 && e.metaKey && !e.shiftKey) {
        e.preventDefault();
        addTodo("");
      } else if (e.keyCode === 8 && e.target.textContent.trim() === "") {
        deleteTodo(todo._id);
      }
    };
    return (
      <div className="TodoList_Wrapper">
        {todos &&
          todos
            .filter(
              item =>
                isBacklog
                  ? !item.date // only want those items with date = null
                  : compareDates(item.date, currentDate) // match current date
            )
            .sort((a, b) => a.dateCreated > b.dateCreated)
            .map(item => {
              const key = item._id;
              return (
                <div key={key}>
                  {isBacklog &&
                    !item.isNote && (
                      <span onClick={() => toggleBacklog(key)}>
                        {" "}
                        <PointLeft />
                      </span>
                    )}
                  {!item.isNote && (
                    <input
                      type="checkbox"
                      checked={item.isComplete}
                      onChange={() => checkItem(key, !item.isComplete)}
                    />
                  )}
                  <ContentEditable
                    html={item.text} // innerHTML of the editable div
                    disabled={false} // use true to disable edition
                    onChange={debounce(e => editTitle(key, e.target.value), 1000)} // handle innerHTML change
                    onKeyDown={handleKeyDown(item)}
                  />
                  {!isBacklog &&
                    !item.isNote && (
                      <span onClick={() => toggleBacklog(key)}>
                        {" "}
                        <PointRight />
                      </span>
                    )}
                </div>
              );
            })}
      </div>
    );
  }
}

const mapPropstoFirebase = (props, ref) => ({
  todos: "todo",
  addTodo: value =>
    ref("todo").add({
      dateCreated: new Date(),
      date: props.isBacklog ? null : props.currentDate,
      text: value,
      isComplete: false
    }),
  addNote: value =>
    ref("todo").add({
      dateCreated: new Date(),
      date: props.currentDate,
      text: value,
      isComplete: false,
      isNote: true
    }),
  deleteTodo: key => ref(`todo/${key}`).delete(),
  checkItem: (key, newCheckStatus) =>
    ref(`todo/${key}`).update({
      isComplete: newCheckStatus
    }),
  toggleBacklog: key =>
    ref(`todo/${key}`).update({
      date: props.isBacklog ? props.currentDate : null
    }),
  editTitle: (key, newTitle) =>
    ref(`todo/${key}`).update({
      text: newTitle
    })
});

export default props => {
  const HOC = connect(mapPropstoFirebase)(TodoList);
  return <CurrentDateContext>{({ state }) => <HOC currentDate={state.currentDate} {...props} />}</CurrentDateContext>;
};

// svg buttons

function PointRight(props) {
  return (
    <button className="PointButton" onClick={props.onClick}>
      <svg
        fill="currentColor"
        preserveAspectRatio="xMidYMid meet"
        height="1em"
        width="1em"
        viewBox="0 0 40 40"
        style={{ verticalAlign: "middle" }}
      >
        <g>
          <path d="m32.5 7.5v25h7.5v-25h-7.5z m-20 7.5h-12.5v10h12.5v7.5l15-12.5-15-12.5v7.5z" />
        </g>
      </svg>
    </button>
  );
}

function PointLeft(props) {
  return (
    <button className="PointButton" onClick={props.onClick}>
      <svg
        fill="currentColor"
        preserveAspectRatio="xMidYMid meet"
        height="1em"
        width="1em"
        viewBox="0 0 40 40"
        style={{ verticalAlign: "middle" }}
      >
        <g>
          <path d="m0 32.5h7.5v-25h-7.5v25z m27.5-17.5v-7.5l-15 12.5 15 12.5v-7.5h12.5v-10h-12.5z" />
        </g>
      </svg>
    </button>
  );
}

function debounce(fn, ms = 500) {
  let timeout;

  return event => {
    clearTimeout(timeout);
    event.persist();
    timeout = setTimeout(() => {
      fn(event);
    }, ms);
  };
}
