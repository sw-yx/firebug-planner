import React, { Component } from "react";
import { AppState } from "./AppState";
import Link from "react-router-dom/Link";
import Route from "react-router-dom/Route";
import matchSorter from "match-sorter";
import { debounce } from "./lang";
import * as Theme from "./theme";
import format from "date-fns/format";
import parse from "date-fns/parse";

const search = (state, query) => matchSorter(state.logs, query, { keys: ["content"] });

class Search extends Component {
  state = {
    results: null,
    selectedIndex: -1
  };

  search = debounce(() => {
    let { appState } = this.props;
    let query = this.input.value.trim();
    this.setState({
      selectedIndex: -1,
      results: query === "" ? null : search(appState, query)
    });
  });

  handleKeyDown = event => {
    let { selectedIndex, results } = this.state;
    if (results) {
      if (event.key === "ArrowDown" && selectedIndex !== results.length - 1) {
        event.preventDefault();
        this.setState({
          selectedIndex: selectedIndex + 1
        });
      } else if (event.key === "ArrowUp" && selectedIndex !== -1) {
        event.preventDefault();
        this.setState({
          selectedIndex: selectedIndex - 1
        });
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (selectedIndex > -1) {
          let note = results[selectedIndex];
          if (note) {
            this.props.history.push({
              pathname: note.day,
              state: {
                searchResult: note.id
              }
            });
          }
        }
      }
    }
  };

  render() {
    const { results, selectedIndex } = this.state;
    return (
      <div
        ref={node => (this.node = node)}
        css={{ flex: 1, position: "relative" }}
        onBlur={event => {
          if (!this.node.contains(event.relatedTarget)) {
            this.setState({ results: null });
          }
        }}
      >
        <div css={{ textAlign: "right" }}>
          <input
            css={{
              background: "#444",
              color: "#fff",
              border: "none",
              fontSize: "100%",
              width: "25vw",
              "::placeholder": {
                color: "#aaa"
              },
              padding: "0.5em"
            }}
            placeholder="Search..."
            type="search"
            ref={node => (this.input = node)}
            onChange={this.search}
            onFocus={this.search}
            onKeyDown={this.handleKeyDown}
          />
        </div>
        {results && (
          <div
            css={{
              overflow: "auto",
              color: Theme.darkest,
              zIndex: 1,
              position: "absolute",
              top: "2em",
              right: 0,
              width: "25vw",
              maxHeight: "90vh",
              background: "#fff",
              boxShadow: "0 5px 20px hsla(0, 0%, 0%, 0.25)"
            }}
          >
            {results.length > 20 && (
              <div
                css={{
                  color: "#aaa",
                  fontSize: "80%",
                  textAlign: "center",
                  padding: "10px",
                  borderBottom: "solid 1px #eee"
                }}
              >
                Showing only 20 of {results.length} results
              </div>
            )}
            {results.slice(0, 20).map((note, index) => (
              <Link
                key={index}
                css={{
                  display: "block",
                  padding: "10px",
                  borderBottom: "solid 1px #eee",
                  font: "inherit",
                  textDecoration: "none",
                  color: "inherit",
                  background: selectedIndex === index ? "#eee" : undefined,
                  ":hover": {
                    background: "#eee"
                  }
                }}
                to={{
                  pathname: `/${note.day}`,
                  state: { searchResult: note.id }
                }}
              >
                <div
                  css={{
                    color: "#888",
                    fontSize: "80%"
                  }}
                >
                  {format(parse(note.day), "dddd, MMMM Do")}
                </div>
                <div dangerouslySetInnerHTML={{ __html: note.content }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default () => (
  <Route>{({ history }) => <AppState>{({ value }) => <Search appState={value} history={history} />}</AppState>}</Route>
);
