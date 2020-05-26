import React, {Component} from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {StatusAvatar} from "../../../../common/status-avatar/status-avatar";
import {messengerApi} from "../../../../../api/common/messenger-api";

export class ChatRoomBubble extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: null,
            showCloseIcon: false
        };
        messengerApi.getUserBubbleBriefInfo(props.userID).then(user => this.setState({user}));
    };

    render() {
        let {user, showCloseIcon} = this.state;
        return (
            <div className="chat-room-bubble"
                 onMouseEnter={() => this.setState({showCloseIcon: true})}
                 onMouseLeave={() => this.setState({showCloseIcon: false})}
            >
                {showCloseIcon && (
                    <div className="chat-box-toggle"
                         onClick={this.props.onClose}
                    >
                        <div>
                            <i className="fal fa-times"></i>
                        </div>

                    </div>
                )}
                {!user ? (
                    <SkeletonTheme color="#e3e3e3" >
                        <Skeleton count={1} height={50} width={50} duration={1} circle={true}/>
                    </SkeletonTheme>
                ) : (
                    <StatusAvatar
                        active={user.active}
                        user={user}
                    />
                )}
            </div>
        );
    }
}
