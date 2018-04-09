import { Component } from "react";
import localforage from "localforage";
import { debounce } from "./lang";

class PersistToStorage extends Component {
  persist = debounce(() => {
    localforage.setItem("data", this.props.value);
  });

  componentDidMount() {
    this.persist();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.persist();
    }
  }

  render() {
    return this.props.children;
  }
}

export default PersistToStorage;
