import React, { Component } from "react";
import { AppState } from "./AppState";
import Notes from "./Notes";

class Log extends Component {
  render() {
    let { dayKey } = this.props;

    return (
      <div
        css={{
          flex: 2,
          display: "flex",
          borderRight: "solid 5px #eee",
          flexDirection: "column"
        }}
      >
        <h2 css={{ textAlign: "center" }}>Notes</h2>
        <AppState>
          {({ value, dispatch }) => (
            <Notes
              notes={value.logs.filter(note => note.day === dayKey)}
              onMoveRight={note => {
                dispatch({ type: "MOVE_NOTE_TO_BACKLOG", note });
              }}
              onNewItemFromWhitespaceClick={() => {
                dispatch({ type: "ADD_NOTE", dayKey });
              }}
              onNewNote={note => {
                dispatch({ type: "ADD_NOTE", dayKey, fromNote: note });
              }}
              onNewTodo={note => {
                dispatch({ type: "ADD_TODO", dayKey, fromNote: note });
              }}
              onCompleteChange={(note, completed) => {
                dispatch({
                  type: "UPDATE_NOTE",
                  note,
                  updates: { completed: completed }
                });
              }}
              onInput={(note, html) => {
                dispatch({
                  type: "UPDATE_NOTE",
                  note,
                  updates: {
                    content: html
                  }
                });
              }}
              onDelete={note => {
                dispatch({ type: "REMOVE_NOTE", note });
              }}
            />
          )}
        </AppState>
      </div>
    );
  }
}

export default Log;
