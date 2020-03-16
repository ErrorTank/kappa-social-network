import React from "react";

export class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    let {label, onChange, value, disabled, className = ""} = this.props;
    return (
      <label className={`common-checkbox ${className}`}
             onClick={e => e.stopPropagation()}
      >
        <input type="checkbox"
               disabled={disabled}
               checked={value}
               onChange={(e) => {
                   e.stopPropagation();
                   return onChange && onChange(!value)
               }}
        />
        {label && label}
        <span className="check-mark"/>
      </label>
    )
  }
}
