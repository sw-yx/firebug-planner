import React, { Component } from "react";
import Note from "./Note";
import { debounce } from "./lang";
import Button from "./Button";

const k = () => {};

class Notes extends Component {
  state = {
    focusIndex: null
  };

  setFocusNote(index) {
    setTimeout(() => {
      this.setState({ focusIndex: index });
    }, 10);
  }

  handleInput = debounce((note, html) => {
    this.props.onInput(note, html);
  });

  render() {
    const {
      notes,
      hideAddNote,
      onCompleteChange = k,
      onNewTodo = k,
      onNewItemFromWhitespaceClick = k,
      onNewNote = k,
      onDelete = k,
      onMoveLeft,
      onMoveRight
    } = this.props;

    const { focusIndex } = this.state;

    return (
      <div
        css={{
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
        ref={node => (this.node = node)}
        onBlur={event => {
          setTimeout(() => {
            if (!this.node.contains(document.activeElement)) {
              this.setState({ focusIndex: -1 });
            }
          }, 10);
        }}
      >
        <div
          onClick={event => {
            if (event.target === event.currentTarget) {
              onNewItemFromWhitespaceClick();
              this.setFocusNote(notes.length);
            }
          }}
          css={{
            flex: 1,
            flexDirection: "column",
            overflow: "auto"
          }}
        >
          {notes.map((note, index) => (
            <Note
              key={note.id}
              {...note}
              takeFocus={focusIndex === index}
              onMoveLeft={
                onMoveLeft
                  ? () => {
                      onMoveLeft(note);
                    }
                  : undefined
              }
              onMoveRight={
                onMoveRight
                  ? () => {
                      onMoveRight(note);
                    }
                  : undefined
              }
              onNewNote={() => {
                onNewNote(note);
                this.setFocusNote(index + 1);
              }}
              onNewTodo={() => {
                onNewTodo(note);
                this.setFocusNote(index + 1);
              }}
              onCompleteChange={completed => {
                onCompleteChange(note, completed);
              }}
              onInput={html => this.handleInput(note, html)}
              onDelete={() => {
                onDelete(note);
                if (index === 0 && notes.length > 1) {
                  this.setFocusNote(0);
                } else if (index !== 0) {
                  this.setFocusNote(index - 1);
                }
              }}
            />
          ))}
        </div>
        <div css={{ display: "flex" }}>
          <Button
            onClick={() => {
              onNewTodo();
              this.setFocusNote(notes.length);
            }}
          >
            + Todo
          </Button>
          {!hideAddNote && (
            <Button
              onClick={() => {
                onNewNote();
                this.setFocusNote(notes.length);
              }}
            >
              + Note
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default Notes;
