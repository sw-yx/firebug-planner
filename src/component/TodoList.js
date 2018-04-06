import React, { Component } from "react";

import { connect } from "react-firebase-firestore";

import { CurrentDateContext } from "../CurrentDate";

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
      deleteTodo,
      toggleBacklog,
      checkItem
    } = this.props;
    return (
      <div>
        <p className="App-intro">{value}</p>
        <ul>
          {todos &&
            todos
              .filter(
                item =>
                  isBacklog
                    ? !item.date // only want those items with date = null
                    : compareDates(item.date, currentDate.toDate()) // match current date
              )
              .map(item => {
                const key = item._id;
                return (
                  <li key={key}>
                    <input
                      type="checkbox"
                      checked={item.isComplete}
                      onChange={() => checkItem(key, !item.isComplete)}
                    />
                    {item.text}
                    <span onClick={() => deleteTodo(key)}> X</span> |
                    <span onClick={() => toggleBacklog(key)}>
                      {" "}
                      {isBacklog ? "⬅️" : "👉"}
                    </span>
                  </li>
                );
              })}
        </ul>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="be productive!" name="newTodo" />
        </form>
      </div>
    );
  }
}

const mapPropstoFirebase = (props, ref) => ({
  todos: "todo",
  addTodo: value =>
    ref("todo").add({
      date: props.isBacklog ? null : props.currentDate.toDate(),
      text: value,
      isComplete: false
    }),
  deleteTodo: key => ref(`todo/${key}`).delete(),
  checkItem: (key, newCheckStatus) =>
    ref(`todo/${key}`).update({
      isComplete: newCheckStatus
    }),
  toggleBacklog: key =>
    ref(`todo/${key}`).update({
      date: props.isBacklog ? props.currentDate.toDate() : null
    })
});

export default props => {
  const HOC = connect(mapPropstoFirebase)(TodoList);
  return (
    <CurrentDateContext>
      {({ state }) => <HOC currentDate={state.currentDate} {...props} />}
    </CurrentDateContext>
  );
};
