import React, { Component } from "react";

const placeCaretAtEnd = node => {
  node.focus();
  let selection = window.getSelection();
  let range = document.createRange();
  range.selectNodeContents(node);
  range.collapse();
  selection.removeAllRanges();
  selection.addRange(range);
};

const k = () => {};

class Editable extends Component {
  componentDidMount() {
    this.node.innerHTML = this.props.html || "";
    if (this.props.takeFocus) {
      placeCaretAtEnd(this.node);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.takeFocus) {
      if (!prevProps.takeFocus || this.props.takeFocusKey !== prevProps.takeFocusKey) {
        setTimeout(() => {
          placeCaretAtEnd(this.node);
        }, 10);
      }
    }
    if (prevProps.html !== this.props.html && document.activeElement !== this.node) {
      this.node.innerHTML = this.props.html;
    }
  }

  render() {
    const { onInput = k } = this.props;
    return (
      <div
        ref={node => (this.node = node)}
        css={{ outline: "none", flex: 1 }}
        contentEditable={true}
        onInput={() => {
          onInput(this.node.innerHTML);
        }}
        onMouseDown={() => {
          this.focusIsMouse = true;
        }}
        onFocus={event => {
          if (this.focusIsMouse) {
            this.focusIsMouse = false;
          } else {
            placeCaretAtEnd(this.node);
          }
        }}
      />
    );
  }
}

export default Editable;
