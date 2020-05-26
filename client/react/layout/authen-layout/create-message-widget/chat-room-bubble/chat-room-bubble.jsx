import React, {Component} from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {StatusAvatar} from "../../../../common/status-avatar/status-avatar";

export class ChatRoomBubble extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: null,
            active: false
        };
    };

    render() {
        let {user, active} = this.state;
        return (
            <div className="chat-room-bubble">
                {!user ? (
                    <SkeletonTheme color="#e3e3e3">
                        <Skeleton count={1} height={50} width={50} duration={1} circle={true}/>
                    </SkeletonTheme>
                ) : (
                    <StatusAvatar
                        active={active}
                        user={user}
                    />
                )}
            </div>
        );
    }
}
