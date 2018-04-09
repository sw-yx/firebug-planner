import React, { Component } from "react";
import { AppState } from "./AppState";
import * as Theme from "./theme";
import NavLink from "react-router-dom/NavLink";
import Empty from "./Empty";
import { Route, Redirect } from "react-router-dom";
import format from "date-fns/format";
import Routines from "./Routines";
import Backlog from "./Backlog";
import Search from "./Search";
import Log from "./Log";
import Calendar from "./Calendar";
import parse from "date-fns/parse";
import Actions from "./Actions";
import Sync from "./Sync";

const AppContainer = props => (
  <div
    {...props}
    css={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}
  />
);

class DateTitle extends Component {
  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const now = new Date();
    return (
      <div css={{ fontWeight: "200", fontSize: "80%" }}>
        <NavLink
          style={{ color: "inherit" }}
          activeStyle={{ textDecoration: "none" }}
          to={`/${format(new Date(), "YYYY-MM-DD")}`}
        >
          Today
        </NavLink>: {format(now, "MM/DD/YY h:mm a")}
      </div>
    );
  }
}

const CurrentPageDisplay = () => (
  <Route
    path="/:dayKey"
    render={({ match }) => {
      let day = parse(match.params.dayKey);
      return (
        <h1
          css={{
            fontSize: "150%",
            fontWeight: "200",
            margin: 0
          }}
        >
          {format(day, "dddd, MMMM Do")} - {format(day, "MM/DD/YY")}
        </h1>
      );
    }}
  />
);

const TopBar = ({ children }) => (
  <div
    css={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: Theme.darkest,
      color: Theme.lightest,
      padding: "10px"
    }}
  >
    <div css={{ flex: 1, display: "flex", alignItems: "center" }}>
      <Sync />
      <DateTitle />
    </div>
    <CurrentPageDisplay />
    <Search />
    <Actions />
  </div>
);

const Routes = () => (
  <Empty>
    <Route path="/" exact render={() => <Redirect to={`/${format(new Date(), "YYYY-MM-DD")}`} />} />
    <Route
      path="/:dayKey"
      render={({ match, location }) => (
        <div css={{ display: "flex", flex: 1 }}>
          <Routines dayKey={match.params.dayKey} />
          <Log dayKey={match.params.dayKey} />
          <Backlog dayKey={match.params.dayKey} />
          <Calendar dayKey={match.params.dayKey} />
        </div>
      )}
    />
  </Empty>
);

export default () => (
  <AppContainer>
    <TopBar />
    <AppState>{({ value }) => <Routes />}</AppState>
  </AppContainer>
);
