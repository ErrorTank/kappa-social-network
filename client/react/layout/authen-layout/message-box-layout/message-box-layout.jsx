import React from 'react';

export const MessageBoxLayout = (props) => {
    let {renderHeader, renderBody} = props;
    return (
        <div className="message-box-layout">
            <div className="mbl-container">
                <div className="mbl-header">
                    {renderHeader()}
                </div>
                <div className="mbl-body">
                    {renderBody()}
                </div>
            </div>

        </div>
    );
};
