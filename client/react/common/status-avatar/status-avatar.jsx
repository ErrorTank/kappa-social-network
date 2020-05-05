import React from 'react';
import {Avatar} from "../avatar/avatar";
import classnames from "classnames";

export const StatusAvatar = ({active, className, ...rest}) => {
    return (
        <div className={classnames("status-avatar", className)}>
            <Avatar
                {...rest}
            />
            {active && (
                <span className="active-status"/>
            )}
        </div>
    );
};

