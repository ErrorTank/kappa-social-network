import React from "react";

export class Badge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    let {style = "success", content, className} = this.props;
    return (
      <span className={`badge badge-${style} ${className ? className : ""}`}>{content}</span>
    );
  }
}
