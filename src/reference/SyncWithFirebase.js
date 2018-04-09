import React, { Component } from "react";
import Firebase from "./Firebase";

let slug = () =>
  Math.random()
    .toString(16)
    .substr(2);

let session = slug();

class SyncWithFirebase extends Component {
  syncingFromFirebase = false;

  sync() {
    let { db, user } = this.props;
    db.ref(`v1/${user.uid}/database`).set({ ...this.props.state, session });
  }

  listenToFirebase() {
    let { db, user, dispatch } = this.props;
    db.ref(`v1/${user.uid}/database`).on("value", snapshot => {
      let val = snapshot.val();
      if (val == null) {
        this.sync();
      } else if (val.session !== session) {
        // somebody else made a change!
        this.syncingFromFirebase = true;
        dispatch({ type: "FIREBASE_CHANGE", state: snapshot.val() });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.syncingFromFirebase) {
      this.syncingFromFirebase = false;
    } else if (!prevProps.user && this.props.user) {
      this.listenToFirebase();
    } else if (
      prevProps.user && // logged in
      prevProps.state !== this.props.state
    ) {
      this.sync();
    }
  }

  render() {
    return this.props.children;
  }
}

export default ({ value: state, dispatch, children }) => (
  <Firebase>
    {({ user, db }) => <SyncWithFirebase state={state} dispatch={dispatch} user={user} db={db} children={children} />}
  </Firebase>
);
