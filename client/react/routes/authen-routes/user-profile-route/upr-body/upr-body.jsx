import React from 'react';
import {UprHeader} from "../upr-header/upr-header";


export const UprBody = ({user, renderChildRoute, friendStatus}) => {
    return (
        <div className="upr-body">
            <div className="upr-body-container common-container">
                {renderChildRoute({
                    user,
                    friendStatus
                })}
            </div>
        </div>
    );
};

