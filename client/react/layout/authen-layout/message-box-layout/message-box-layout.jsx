import React from 'react';
import {ThemeContext} from "../../../context/theme-context";
import classnames from "classnames";

export const MessageBoxLayout = (props) => {
    let {renderHeader, renderBody, className} = props;
    console.log(className)
    return (
        <ThemeContext.Consumer>
            {({darkMode}) => (
                <div className={classnames("message-box-layout", {darkMode}, className)}>
                    <div className="mbl-container">
                        <div className="mbl-header">
                            {renderHeader()}
                        </div>
                        <div className="mbl-body">
                            {renderBody()}
                        </div>
                    </div>

                </div>
            )}

        </ThemeContext.Consumer>
    );
};
