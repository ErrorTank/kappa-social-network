import React from 'react';


export const UprBody = ({user, renderChildRoute}) => {
    return (
        <div className="upr-body">
            <div className="upr-body-container common-container">
                {renderChildRoute({
                    user
                })}
            </div>
        </div>
    );
};

