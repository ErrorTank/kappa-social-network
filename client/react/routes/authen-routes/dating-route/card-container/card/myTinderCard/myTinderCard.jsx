import React, { Component } from "react";
import classnames from "classnames";
import { datingApi } from "./../../../../../../../api/common/dating";

export class MyTinderCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }
  onSwipeLeft = () => {
    this.setState({
      current:
        this.state.current === 0
          ? this.props.info.avatars.length - 1
          : this.state.current - 1,
    });
  };
  onSwipeRight = () => {
    this.setState({
      current:
        this.state.current === this.props.info.avatars.length - 1
          ? 0
          : this.state.current + 1,
    });
  };
  onNavigate = (i) => {
    this.setState({
      current: i,
    });
  };
  render() {
    let { info } = this.props;
    let { current } = this.state;
    let avatar = info.avatars[current].path;
    return (
      <div className="my-tinder-card">
        <img src={avatar} />
        <div className="avatar-navigator">
          {info.avatars.length > 1 &&
            info.avatars.map((e, i) => {
              return (
                <div
                  className={classnames("navigator-box", {
                    active: i === current,
                  })}
                  key={i}
                >
                  <div
                    className="card-box"
                    onClick={() => this.onNavigate(i)}
                  ></div>
                </div>
              );
            })}
        </div>
        {info.avatars.length > 1 && (
          <>
            <i
              className="fas fa-chevron-left swipe-left"
              onClick={this.onSwipeLeft}
            ></i>
            <i
              className="fas fa-chevron-right swipe-right"
              onClick={this.onSwipeRight}
            ></i>
          </>
        )}
        <h3>{info.name}</h3>
      </div>
    );
  }
}
