import React from "react";
import classnames from "classnames"
import {getNamePrefix} from "../../../common/utils/common";

export const Avatar = props => {
    let {className, user, getName = item => item.basic_info.username, circle = true} = props;

    return (
        <div className={classnames("common-avatar", className, {rectangle: !circle })}>
            {user.avatar ? (
                <img src={user.avatar}/>

            ) : (
                <div className="avatar-holder">
                    <span>{getNamePrefix(getName(user).trim())}</span>
                </div>
            )}
        </div>
    )
};

