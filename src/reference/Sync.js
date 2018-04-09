import React, { Component } from "react";
import SyncDisabledIcon from "react-icons/lib/md/sync-disabled";
import Firebase from "./Firebase";

class Sync extends Component {
  render() {
    return (
      <Firebase>
        {({ user, login }) => (
          <div
            css={{
              display: "flex",
              fontSize: "150%",
              margin: "0 10px"
            }}
          >
            {user ? (
              <div
                css={{
                  background: `url(${user.photoURL}) center center`,
                  backgroundSize: "cover",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  marginRight: "10px"
                }}
              />
            ) : (
              <button
                css={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "5px",
                  width: "40px",
                  alignItems: "center",
                  borderRadius: "3px",
                  ":hover": {
                    background: "#333"
                  },
                  ":active": {
                    background: "#222"
                  }
                }}
                onClick={login}
              >
                <SyncDisabledIcon />
              </button>
            )}
          </div>
        )}
      </Firebase>
    );
  }
}

export default Sync;
