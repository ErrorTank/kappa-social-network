import React, { Component } from "react";
import { Header } from "./header/header";
import classnames from "classnames";
import { DatingMatched } from "./dating-tabs/dating-matched";
import { DatingLike } from "./dating-tabs/dating-like";

const LEFT_PANEL_TABS = {
  MATCHES: "MATCHES",
  LIKE_YOU: "LIKE_YOU",
  MESSAGE: "MESSAGE",
};

export class DatingLeftPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: LEFT_PANEL_TABS.MATCHES,
    };
  }
  render() {
    let tabNavigators = [
      {
        label: "Kết đôi",
        mode: LEFT_PANEL_TABS.MATCHES,
        component: DatingMatched,
      },
      {
        label: "Đã thích bạn",
        mode: LEFT_PANEL_TABS.LIKE_YOU,
        component: DatingLike,
      },
      {
        label: "Tin nhắn",
        mode: LEFT_PANEL_TABS.MESSAGE,
      },
    ];
    let { mode } = this.state;
    let Comp = tabNavigators.find((each) => each.mode === mode).component;
    return (
      <div className="dating-left-panel">
        <Header />
        <div className="dating-home-tab">
          {tabNavigators.map((each, i) => (
            <div
              onClick={() => this.setState({ mode: each.mode })}
              className={classnames("tab-button", {
                active: each.mode === mode,
              })}
              key={i}
            >
              {each.label}
            </div>
          ))}
        </div>
        <div className="dating-left-body">
          <Comp />
        </div>
      </div>
    );
  }
}
