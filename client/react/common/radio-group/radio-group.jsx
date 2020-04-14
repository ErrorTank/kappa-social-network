import React from "react";
import {Radio} from "./radio";
import classnames from "classnames"

export class RadioGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {label, value, options, displayAs = value => value, isChecked = () => false, onChange, className, error = null} = this.props;
        return (
            <div className={classnames(`radio-group`, className)}>
                {label && (
                    <p className="radio-group-label">{label}</p>
                )}

                <div className="radio-list">
                    {options.map((each, i) => (
                        <div className="radio-wrapper" key={i}>
                            <Radio
                                id={each.id}
                                checked={isChecked(each)}
                                label={displayAs(each)}
                                value={each.value}
                                onChange={() => {
                                    onChange(each)
                                }}
                            />
                        </div>
                    ))}
                </div>
                {(error) && (
                    <div className="invalid-feedback">{error.message}</div>
                )}
            </div>
        );
    }
}
