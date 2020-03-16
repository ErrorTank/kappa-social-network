import get from "lodash/get";
import React from "react";

export class KComponent extends React.Component {
  onUnmounts = [];
  watchPropsListeners = [];
  watchStateListeners = [];
  onMounts = [];

  componentDidMount() {
    this.mounted = true;
    this.onMounts.forEach((onMount) => onMount());
  }


  componentWillUnmount() {
    this.mounted = false;
    this.onUnmounts.forEach((onUnmount) => onUnmount());
  }

  componentWillReceiveProps(nextProps) {
    this.watchPropsListeners.forEach((l) => l(nextProps, this.props));
  }

  componentWillUpdate(nextProps, nextState) {
    this.watchStateListeners.forEach((l) => l(nextState));
  }

  onMount(f) {
    this.onMounts.push(f);
  }

  onUnmount(f) {
    this.onUnmounts.push(f);
  }

  watchProps(propName, listener, firstRun = true) {
    if (listener === undefined) {
      listener = propName;
      this.watchPropsListeners.push(listener);

      setImmediate(() => listener(this.props, undefined));

      return;
    }

    let currentValue = get(this.props, propName);

    // First run
    if (firstRun) {
      setImmediate(() => listener(currentValue, currentValue));
    }

    this.watchPropsListeners.push((nextProps) => {
      let updated = get(nextProps, propName);
      if (updated != currentValue) {
        listener(updated, currentValue);
        currentValue = updated;
      }
    });
  }
}
