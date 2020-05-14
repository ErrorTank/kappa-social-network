import React from "react";
import classnames from "classnames"
import {ThemeContext} from "../../context/theme-context";

export class CommonInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    focus = () => {
        this.input.focus();
    };

    render() {
        const {className, textArea = false, success = false, extraDisplay, error = false, label = null, displayErr = true, helper = null, id, icon, inputType = "input", ...others} = this.props;
        return (
            <ThemeContext.Consumer>
               {(theme) => (
                   <div className={classnames("common-input", className, {darkMode: theme?.darkMode})}>
                       {
                           label && <label htmlFor={id}>{label}</label>
                       }

                       {textArea ? (
                           <textarea className="form-control" id={id} {...others}></textarea>
                       ) : extraDisplay ? (
                           <div className="input-wrapper">
                               <input className={classnames("form-control", {"is-invalid": error, "is-valid": success})}
                                      id={id} {...others} ref={input => this.input = input}/>
                               {extraDisplay}
                           </div>
                       ) : (
                           <input className={classnames("form-control", {"is-invalid": error, "is-valid": success})}
                                  ref={input => this.input = input} id={id} {...others}/>
                       )

                       }


                       {(error && displayErr) && (
                           <div className="invalid-feedback">{error.message}</div>
                       )}
                       {(success) && (
                           <div className="valid-feedback">{success.message}</div>
                       )}
                   </div>
               )}
            </ThemeContext.Consumer>
        );

    }
}