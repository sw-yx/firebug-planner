import React, { Component } from "react";

import { connect } from "react-firebase-firestore";

import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

import TodoList from "./TodoList";

import "./Main.css";

class Main extends Component {
  state = {
    currentDate: moment()
  };
  handleDateChange = date => {
    this.setState({
      currentDate: date
    });
  };

  render() {
    const { currentDate } = this.state;
    return (
      <div>
        <div className="panelLayout">
          <div>left panel</div>
          <div>
            Notes <TodoList currentDate={currentDate} />
          </div>
          <div>
            Backlog <TodoList currentDate={currentDate} isBacklog />
          </div>
          <div>
            Calendar
            <DatePicker
              selected={currentDate}
              onChange={this.handleDateChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

// export default connect(mapPropstoFirebase)(Main);
export default Main;
