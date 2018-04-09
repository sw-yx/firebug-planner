import React, { Component } from "react";
import More from "react-icons/lib/md/more-vert";
import Download from "react-icons/lib/md/cloud-download";
import Upload from "react-icons/lib/md/cloud-upload";
import { AppState } from "./AppState";
import * as Theme from "./theme";

class UploadData extends Component {
  handleInput = e => {
    console.log("here?!");
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = e => {
      const result = e.target.result;
      const json = JSON.parse(result);
      this.props.onRead(json);
    };
    reader.readAsText(file);
  };

  render() {
    return (
      <div
        css={{
          position: "relative",
          color: "#333",
          ":hover": {
            background: "#ddd"
          },
          fontSize: "90%",
          padding: "8px 0px"
        }}
      >
        <input
          type="file"
          css={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 1,
            opacity: 0
          }}
          onChange={this.handleInput}
        />
        <Upload css={{ marginLeft: "25px", marginRight: "20px" }} />{" "}
        <span css={{ marginRight: "35px" }}>Import database</span>
      </div>
    );
  }
}

class Save extends Component {
  state = {
    href: null
  };

  setHref = () => {
    this.setState({
      href: `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.props.data, null, 2))}`
    });
  };

  render() {
    const { href } = this.state;
    return (
      <a
        {...this.props}
        onMouseEnter={this.setHref}
        onFocus={this.setHref}
        href={href}
        download="planner-database.json"
        css={{
          display: "block",
          color: "#333",
          ":hover": {
            background: "#ddd"
          },
          fontSize: "90%",
          padding: "8px 0px",
          borderRadius: "0",
          textDecoration: "none",
          cursor: "default"
        }}
      >
        <Download css={{ marginLeft: "25px", marginRight: "20px" }} />{" "}
        <span css={{ marginRight: "35px" }}>Export database</span>
      </a>
    );
  }
}

class Actions extends Component {
  state = {
    isOpen: false
  };

  render() {
    let { isOpen } = this.state;
    let { appState, dispatch } = this.props;

    return (
      <div
        ref={node => (this.node = node)}
        css={{ position: "relative" }}
        onBlur={event => {
          setTimeout(() => {
            if (!this.node.contains(document.activeElement)) {
              this.setState({ isOpen: false });
            }
          }, 0);
        }}
      >
        <button
          onClick={() => {
            this.setState({ isOpen: !this.state.isOpen });
          }}
          css={{
            color: "#aaa",
            outline: "none",
            ":hover": {
              background: "#444"
            },
            ":focus": {
              background: "#444"
            },
            border: "none",
            margin: "0",
            font: "inherit",
            background: "none",
            fontSize: "125%",
            padding: "4px 6px",
            marginLeft: "8px",
            borderRadius: "2px"
          }}
        >
          <More />
        </button>
        {isOpen && (
          <div
            css={{
              color: Theme.darkest,
              zIndex: 1,
              position: "absolute",
              top: "2em",
              right: 0,
              whiteSpace: "nowrap",
              background: "#fff",
              boxShadow: "0 5px 20px hsla(0, 0%, 0%, 0.25)",
              padding: "5px 0px"
            }}
          >
            <Save
              data={appState}
              onClick={() => {
                this.setState({ isOpen: false });
              }}
            />
            <UploadData
              onRead={data => {
                dispatch({ type: "HOLY_CRAP", state: data });
                this.setState({ isOpen: false });
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default () => <AppState>{({ value, dispatch }) => <Actions appState={value} dispatch={dispatch} />}</AppState>;
