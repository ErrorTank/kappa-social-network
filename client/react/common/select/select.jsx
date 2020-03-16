import React from "react";
import classnames from "classnames"

export class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    //todo create tooltip

    render() {
        let {className, label, id, options, value, onChange, displayAs = null, getValue = null, disabled = false, error} = this.props;
        return (
            <div className={classnames("form-group common-select m-0", className, {error: !!error})}>
                {label && (
                    <label htmlFor={id}>{label}</label>
                )

                }

                <select className="form-control" id={id}
                        value={getValue(value)}
                        onChange={onChange}
                        disabled={disabled}
                >
                    {options.map((each, i) => (
                        <option
                            key={i}
                            value={getValue ? getValue(each) : each.value}
                        >
                            {displayAs ? displayAs(each) : each.label}
                        </option>
                    ))}
                </select>
                {(error) && (
                    <div className="error-msg">{error.message}</div>
                )}
            </div>
        );
    }
}