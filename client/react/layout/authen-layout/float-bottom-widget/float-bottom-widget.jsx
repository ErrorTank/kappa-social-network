import React from 'react';
import classnames from "classnames"
import {ThemeContext} from "../../../context/theme-context";

const FloatBottomWidget = ({renderSide, renderBox, className}) => {
    return (
        <ThemeContext.Consumer>
            {({darkMode}) => (
                <div className={classnames("float-bottom-widget", className, {darkMode})}>
                    <div className="fbw-container">
                        <div className="fbw-side">
                            {renderSide()}
                        </div>
                        <div className="fbw-box">
                            {renderBox()}
                        </div>
                    </div>
                </div>
            )}
        </ThemeContext.Consumer>
    );
};

export default FloatBottomWidget;