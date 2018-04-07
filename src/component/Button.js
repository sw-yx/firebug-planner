import React from "react";

import "./Button.css";
export default class Button extends React.Component {
  render() {
    const { label, onClick } = this.props;
    return (
      <button className="Button" onClick={onClick}>
        {label}
      </button>
    );
  }
}
