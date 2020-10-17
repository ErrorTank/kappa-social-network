import React, { Component } from "react";
import { DatingTabPanel } from "../dating-tab-panel";
import { DatingMessage } from "./dating-message/dating-message";

export class DatingLeftPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "TABS",
      defaultTab: null,
      selectedProfile: null,
    };
  }
  onSwitch = ({ mode, defaultTab = null, selectedProfile }) => {
    this.setState({
      mode,
      defaultTab,
      selectedProfile,
    });
  };

  render() {
    return this.state.mode === "TABS" ? (
      <DatingTabPanel
        defaultTab={this.state.defaultTab}
        onSwitch={(selectedProfile) =>
          this.onSwitch({ mode: "MESSAGE", selectedProfile })
        }
      />
    ) : (
      <DatingMessage
        selectedProfile={selectedProfile}
        onSwitch={(defaultTab) => this.onSwitch({ mode: "TABS", defaultTab })}
      />
    );
  }
}
