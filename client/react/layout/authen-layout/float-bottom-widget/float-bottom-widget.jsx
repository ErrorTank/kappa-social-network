import React from 'react';
import classnames from "classnames"

const FloatBottomWidget = ({renderSide, renderBox, className}) => {
    return (
        <div className={classnames("float-bottom-widget", className)}>
            <div className="fbw-container">
                <div className="fbw-side">
                    {renderSide()}
                </div>
                <div className="fbw-box">
                    {renderBox()}
                </div>
            </div>
        </div>
    );
};

export default FloatBottomWidget;