import React, { Component } from "react";
import classnames from "classnames";
import { Tooltip } from "./../../../../../common/tooltip/tooltip";

export class DatingCardActions extends Component {
  render() {
    const actions = [
      {
        className: "skip",
        label: "Bỏ qua",
        icon: <i className="fas fa-times"></i>,
        onClick: this.props.onDislike,
      },
      {
        className: "like",
        label: "Thích",
        icon: <i className="fas fa-heart"></i>,
        onClick: this.props.onLike,
      },
    ];
    return (
      <div className="dating-card-actions">
        {actions.map((action, index) => (
          <Tooltip key={index} position="top" text={() => action.label}>
            <div
              className={classnames("action", action.className)}
              onClick={action.onClick}
            >
              {action.icon}
            </div>
          </Tooltip>
        ))}
      </div>
    );
  }
}
