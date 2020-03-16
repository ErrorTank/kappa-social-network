import React from "react";

export class SwitchBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    let {label, value, onToggle, className = ''} = this.props;
    return (

      <div className={`switch-btn checkbox switcher ${className}`}>

        {label && (
            <div className="switch-label">
              {label}
            </div>
        )}
        <label>
          <input type="checkbox"
                 checked={value}
                 onChange={() => onToggle(!value)}
          />
          <span><small></small></span>

        </label>
      </div>
    )
  }
}
