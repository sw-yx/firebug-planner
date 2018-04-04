import React, { Component } from "react";

import { connect } from "react-firebase-firestore";

import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

function compareDates(a, b) {
  return a && a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

class TodoList extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const { currentDate } = this.props;
    this.props.addTodo(e.target.newTodo.value, currentDate);
    e.target.newTodo.value = "";
  };
  deleteItem = key => {
    this.props.deleteTodo(key);
  };
  backlogItem = key => {
    const { currentDate, isBacklog } = this.props;
    this.props.backlogItem(key, isBacklog ? currentDate.toDate() : null);
  };
  checkItem = (key, newCheckStatus) => {
    this.props.checkItem(key, newCheckStatus);
  };

  render() {
    const { value, todos, currentDate, isBacklog } = this.props;
    return (
      <div>
        <ul>
          {todos &&
            todos
              .filter(
                item =>
                  !isBacklog
                    ? compareDates(item.date, currentDate.toDate()) // item.date is curdate
                    : !item.date // item.date == null
              )
              .map(item => {
                const key = item._id;
                return (
                  <li key={key}>
                    <input
                      type="checkbox"
                      checked={item.isComplete}
                      onClick={() => this.checkItem(key, !item.isComplete)}
                    />
                    {item.text}
                    <span onClick={() => this.deleteItem(key)}> X</span> |
                    <span onClick={() => this.backlogItem(key)}>
                      {" "}
                      {!isBacklog ? "➡️" : "⬅️"}
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
  addTodo: (value, currentDate) =>
    ref("todo").add({
      date: props.isBacklog ? null : currentDate.toDate(),
      text: value,
      isComplete: false
    }),
  deleteTodo: key => ref(`todo/${key}`).delete(),
  checkItem: (key, newCheckStatus) =>
    ref(`todo/${key}`).update({
      isComplete: newCheckStatus
    }),
  backlogItem: (key, newDateField) =>
    ref(`todo/${key}`).update({
      date: newDateField
    })
});

export default connect(mapPropstoFirebase)(TodoList);
