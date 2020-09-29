import React, { Component } from "react";
import { DatingCardActions } from "./action/action";
import { DatingCard } from "./card/datingCard";

export class CardContainer extends Component {
  render() {
    return (
      <div className="container">
        <div className="card-container">
          <div className="top-panel">
            <DatingCard />
          </div>
        </div>
      </div>
    );
  }
}
