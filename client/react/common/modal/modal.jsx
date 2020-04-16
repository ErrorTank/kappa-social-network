import React from "react";
import classnames from "classnames"

export class Modal extends React.Component {
  overlayElem = null;
  constructor(props) {
    super(props);

    this.state = {};

    document.body.style.overflowY = "hidden";
  };

  componentWillUnmount() {
    setTimeout(() => {
      document.body.style.overflowY = null;
    }, 300);
  }


  render() {
    const {className, onDismiss, content, disabledOverlayClose} = this.props;

    return (
      <div className={classnames("modal k-modal", className)}
           onMouseDown={(e) => e.target === this.overlayElem && !disabledOverlayClose && onDismiss()}
           ref={(elem) => this.overlayElem = elem}
      >
        <div
          className="modal-overlay"

        >
          <div className="modal-content">
            {content}
          </div>


        </div>
      </div>
    );
  }
}
