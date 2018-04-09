import React, { Component } from "react";
import Route from "react-router-dom/Route";
import MoveLeft from "react-icons/lib/go/move-left";
import MoveRight from "react-icons/lib/go/move-right";
import * as Theme from "./theme";
import Editable from "./Editable";
import { css } from "glamor";

let fadeBg = css.keyframes({
  "0%": { backgroundColor: "#fff" },
  "10%": { backgroundColor: "#fff" },
  "20%": { backgroundColor: "#FFFACD" },
  "30%": { backgroundColor: "#fff" },
  "40%": { backgroundColor: "#fff" },
  "50%": { backgroundColor: "#FFFACD" },
  "100%": { backgroundColor: "#fff" }
});

const k = () => {};

class Note extends Component {
  render() {
    const {
      todo,
      completed,
      takeFocus,
      content,
      isSearchResult,
      location,
      onInput = k,
      onDelete = k,
      onNewNote = k,
      onNewTodo = k,
      onCompleteChange = k,
      onMoveLeft,
      onMoveRight
    } = this.props;

    return (
      <div
        ref={node => (this.rootNode = node)}
        css={{
          display: "flex",
          padding: "1em",
          borderBottom: "1px solid #eee",
          animation: isSearchResult ? `${fadeBg} 2s 1` : undefined,
          ":last-child": {
            border: "none"
          }
        }}
        onKeyDown={event => {
          if (event.key === "Escape") {
            document.activeElement.blur();
          }

          if (event.metaKey && event.key === "Enter") {
            if (event.shiftKey) {
              onNewNote();
            } else {
              onNewTodo();
            }
          }

          if (event.key === "Backspace" && event.target.textContent.trim() === "") {
            onDelete();
          }
        }}
      >
        {onMoveLeft && (
          <div css={{ position: "relative", top: "-1px" }}>
            <button
              css={{
                font: "inherit",
                padding: 0,
                background: "none",
                border: "none",
                color: "#ccc",
                ":hover": {
                  color: "#aaa"
                },
                ":focus": {
                  color: Theme.ctaBackground
                },
                position: "relative",
                margin: "0",
                marginRight: "0.5em",
                ":active": {
                  top: "1px",
                  left: "1px"
                }
              }}
              onClick={onMoveLeft}
            >
              <MoveLeft />
            </button>
          </div>
        )}

        {todo && (
          <div css={{ position: "relative", top: "-1px" }}>
            <input
              css={{ marginRight: "10px" }}
              type="checkbox"
              checked={completed}
              onChange={event => {
                onCompleteChange(event.target.checked);
              }}
            />
          </div>
        )}
        <Editable
          takeFocus={takeFocus || isSearchResult}
          takeFocusKey={location.key}
          html={content}
          onInput={html => {
            onInput(html);
          }}
        />

        {todo &&
          !completed &&
          onMoveRight && (
            <div>
              <button
                css={{
                  font: "inherit",
                  padding: 0,
                  background: "none",
                  border: "none",
                  color: "#ccc",
                  ":hover": {
                    color: "#aaa"
                  },
                  ":focus": {
                    color: Theme.ctaBackground
                  },
                  position: "relative",
                  margin: "0",
                  marginLeft: "0.25em",
                  ":active": {
                    top: "1px",
                    left: "1px"
                  }
                }}
                onClick={onMoveRight}
              >
                <MoveRight />
              </button>
            </div>
          )}
      </div>
    );
  }
}

export default props => (
  <Route
    render={({ location }) => (
      <Note
        {...props}
        location={location}
        isSearchResult={location.state && location.state.searchResult === props.id}
      />
    )}
  />
);
