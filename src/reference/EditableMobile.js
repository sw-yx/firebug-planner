import React, { Component } from "react";

const placeCaretAtEnd = node => {
  if (node.getBoundingClientRect().bottom > window.innerHeight) {
    node.scrollIntoView();
  }
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
    if (this.props.takeFocus && !prevProps.takeFocus) {
      placeCaretAtEnd(this.node);
    }
    if (prevProps.html !== this.props.html && document.activeElement !== this.node) {
      this.node.innerHTML = this.props.html;
    }
  }

  render() {
    const { onDelete = k, onInput = k } = this.props;
    return (
      <div
        ref={node => (this.node = node)}
        css={{
          flex: 1,
          WebkitTapHighlightColor: "rgba(0, 0, 0, 0)"
        }}
        contentEditable={true}
        onKeyDown={event => {
          if (event.key === "Backspace" && event.target.textContent.trim() === "") {
            onDelete();
          }
        }}
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
