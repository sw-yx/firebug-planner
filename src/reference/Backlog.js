import React, { Component } from "react";
import { AppState } from "./AppState";
import Notes from "./Notes";

class Backlog extends Component {
  render() {
    const { dayKey } = this.props;

    return (
      <div
        css={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRight: "solid 5px #eee"
        }}
      >
        <h2 css={{ textAlign: "center" }}>Backlog</h2>
        <AppState>
          {({ value, dispatch }) => (
            <Notes
              hideAddNote={true}
              onMoveLeft={note => {
                dispatch({ type: "MOVE_NOTE_TO_DAY", note, day: dayKey });
              }}
              notes={value.backlog}
              onNewItemFromWhitespaceClick={() => {
                dispatch({ type: "ADD_BACKLOG_NOTE" });
              }}
              onNewTodo={note => {
                dispatch({ type: "ADD_BACKLOG_NOTE", fromNote: note });
              }}
              onCompleteChange={(note, completed) => {
                dispatch({
                  type: "COMPLETE_CHANGE_BACKLOG_NOTE",
                  note,
                  completed
                });
              }}
              onInput={(note, html) => {
                dispatch({
                  type: "UPDATE_BACKLOG_NOTE",
                  note,
                  updates: {
                    content: html
                  }
                });
              }}
              onDelete={note => {
                dispatch({ type: "REMOVE_BACKLOG_NOTE", note });
              }}
            />
          )}
        </AppState>
      </div>
    );
  }
}

export default Backlog;
