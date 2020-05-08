import React from "react";
import classnames from "classnames"
import {getNamePrefix} from "../../../common/utils/common";

export const Avatar = props => {
    let {className, user, getName = item => item.basic_info.username} = props;

    return (
        <div className={classnames("common-avatar", className)}>
            {user.avatar ? (
                <img src={user.avatar}/>

            ) : (
                <div className="avatar-holder">
                    <span>{getNamePrefix(getName(user))}</span>
                </div>
            )}
        </div>
    )
};

