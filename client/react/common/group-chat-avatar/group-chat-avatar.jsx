import React from 'react';
import {Avatar} from "../avatar/avatar";
import classnames from "classnames";

export const GroupChatAvatar = ({active, className, users}) => {
    console.log(users)
    return (
        <div className={classnames("group-chat-avatar", className)}>
            {users.slice(0, 2).map((each, i) => (
                <Avatar
                    className={"gca-" + (i + 1)}
                    key={each._id}
                    user={each}
                />
            ))}

            {active && (
                <span className="active-status"/>
            )}
        </div>
    );
};

