import React, { Component } from "react";
import { Card } from "./card/card";
import { DatingCardActions } from "./action/action";

export class CardContainer extends Component {
  render() {
    return (
      <div className="container">
        <div className="card-container">
          <div className="top-panel">{/* <Card /> */}</div>

          <div className="bot-panel">
            <DatingCardActions />
          </div>
        </div>
      </div>
    );
  }
}
