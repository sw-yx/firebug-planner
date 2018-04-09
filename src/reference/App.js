import FAKE_DATA from "./FAKE_DATA";
import Media from "react-media";
import localforage from "localforage";
import React, { Component } from "react";
import Router from "react-router-dom/BrowserRouter";
import Desktop from "./Desktop";
import { AppStateProvider, Middleware } from "./AppState";
import PersistToStorage from "./PersistToStorage";
import SyncWithFirebase from "./SyncWithFirebase";
import reduceAppState from "./reduceAppState";
import Mobile from "./Mobile";

class App extends Component {
  state = {
    data: null,
    err: null
  };

  componentWillMount() {
    localforage.getItem("data", (err, data) => {
      this.setState({
        err,
        data: data ? data : FAKE_DATA
      });
    });
  }

  render() {
    let { data, err } = this.state;

    if (err) {
      return <pre>{err.message}</pre>;
    }

    return !data ? null : (
      <AppStateProvider defaultValue={data} reducer={reduceAppState}>
        <Middleware component={PersistToStorage}>
          <Middleware component={SyncWithFirebase}>
            <Router>
              <Media query="(max-width: 900px)">{small => (small ? <Mobile /> : <Desktop />)}</Media>
            </Router>
          </Middleware>
        </Middleware>
      </AppStateProvider>
    );
  }
}

export default App;
