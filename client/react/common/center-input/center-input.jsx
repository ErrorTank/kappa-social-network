import React, {Component} from 'react';
import classnames from "classnames";

export class CenterInput extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let {className, error = false, id,  ...rest} = this.props;
        return (
            <div className={classnames("center-input-wrapper", className)}>
                <input
                    className={classnames("center-input", {"is-invalid": error})}
                    id={id}
                    autoComplete={false}
                    {...rest}
                />
                {(error) && (
                    <div className="invalid-feedback">{error.message}</div>
                )}
            </div>
        );
    }
}
