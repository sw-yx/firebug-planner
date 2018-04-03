import React, { Component } from "react";

import { connect } from "react-firebase";

class Main extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.addTodo(e.target.newTodo.value);
    e.target.newTodo.value = "";
  };
  deleteItem = key => {
    this.props.deleteTodo(key);
  };
  checkItem = (key, newCheckStatus) => {
    this.props.checkItem(key, newCheckStatus);
  };
  render() {
    const { value, todos } = this.props;
    return (
      <div>
        <p className="App-intro">{value}</p>
        <ul>
          {todos &&
            Object.entries(todos).map(([key, item]) => {
              return (
                <li key={key}>
                  <input
                    type="checkbox"
                    checked={item.isComplete}
                    onClick={() => this.checkItem(key, !item.isComplete)}
                  />
                  {item.text}
                  <span onClick={() => this.deleteItem(key)}> X</span>
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
    ref("todo").push({
      date: new Date().toDateString(),
      text: value,
      isComplete: false
    }),
  deleteTodo: key => ref(`todo/${key}`).remove(),
  checkItem: (key, newCheckStatus) =>
    ref(`todo/${key}`).update({
      isComplete: newCheckStatus
    })
});

export default connect(mapPropstoFirebase)(Main);
