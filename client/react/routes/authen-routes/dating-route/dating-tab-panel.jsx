import React, { Component } from "react";
import { Header } from "./header/header";
import classnames from "classnames";
import { DatingMatched } from "./dating-tabs/dating-matched";
import { DatingLike } from "./dating-tabs/dating-like";
import { DatingMessageTab } from "./dating-tabs/dating-message-tab";
import { customHistory } from "./../../routes";

export const datingTabPanelUtilities = {};

export const TAB_PANEL_TABS = {
  MATCHES: "MATCHES",
  LIKE_YOU: "LIKE_YOU",
  MESSAGE: "MESSAGE",
};

export class DatingTabPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: props.defaultTab || TAB_PANEL_TABS.MATCHES,
    };
    datingTabPanelUtilities.setTab = (tab) => {
      this.setState({
        mode: TAB_PANEL_TABS[tab],
      });
    };
  }
  render() {
    let tabNavigators = [
      {
        label: "Kết đôi",
        mode: TAB_PANEL_TABS.MATCHES,
        component: DatingMatched,
      },
      {
        label: "Đã thích bạn",
        mode: TAB_PANEL_TABS.LIKE_YOU,
        component: DatingLike,
      },
      {
        label: "Tin nhắn",
        mode: TAB_PANEL_TABS.MESSAGE,
        component: DatingMessageTab,
      },
    ];
    let { mode } = this.state;
    let { onSwitch, onClickProfile } = this.props;
    let Comp = tabNavigators.find((each) => each.mode === mode).component;
    return (
      <div className="dating-tab-panel">
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
        <div className="dating-tab-body">
          <Comp onSwitch={onSwitch} onClickProfile={onClickProfile} />
        </div>
      </div>
    );
  }
}
