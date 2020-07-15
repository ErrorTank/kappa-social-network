import React, {Component} from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {StatusAvatar} from "../../../../common/status-avatar/status-avatar";
import {messengerApi} from "../../../../../api/common/messenger-api";
import {ThemeContext} from "../../../../context/theme-context";
import {WithUserStatus} from "../../../../common/user-statuts-subcriber/user-status-subscriber";
import {messageWidgetController} from "../create-message-widget";

export class ChatRoomBubble extends Component {
    constructor(props){
        super(props);
        this.state = {
            showCloseIcon: false
        };
        messengerApi.getUserBubbleBriefInfo(props.userID).then(user => props.onFetch(user));
    };


    render() {
        let {showCloseIcon } = this.state;
        let {onClick, userInfo, userID, showUnseenCount} = this.props;

        return (
            <WithUserStatus
                userID={userInfo?._id}
                status={{
                    active: userInfo?.active,
                    last_active_at: userInfo?.last_active_at
                }}
            >
                {(status) => (
                    <ThemeContext.Consumer>
                        {({darkMode}) => (
                            <div className="chat-room-bubble"
                                 onMouseEnter={() => this.setState({showCloseIcon: true})}
                                 onMouseLeave={() => this.setState({showCloseIcon: false})}
                                 onClick={onClick}
                            >
                                {showUnseenCount && !!userInfo?.unseen_messages.length && (
                                    <div className="unseen-count">
                                        <span>{userInfo.unseen_messages.length < 10 ? userInfo.unseen_messages.length : "9+"}</span>
                                    </div>
                                )}
                                {showCloseIcon && (
                                    <div className="chat-box-toggle"
                                         onClick={(e) => {
                                             e.stopPropagation();
                                             this.props.onClose();
                                         }}
                                    >
                                        <div>
                                            <i className="fal fa-times"></i>
                                        </div>

                                    </div>
                                )}
                                {!userInfo ? (
                                    <SkeletonTheme color={darkMode ? "#242526" : "#e3e3e3"} highlightColor={darkMode ? "#333436" : "#ebebeb"}>
                                        <Skeleton count={1} height={50} width={50} duration={1} circle={true}/>
                                    </SkeletonTheme>
                                ) : (
                                    <StatusAvatar
                                        active={status.active}
                                        user={userInfo}
                                    />
                                )}
                            </div>
                        )}
                    </ThemeContext.Consumer>
                )}
            </WithUserStatus>

        );
    }
}
