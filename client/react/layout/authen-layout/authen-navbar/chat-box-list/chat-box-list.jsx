import React, {Component} from 'react';
import {messengerApi} from "../../../../../api/common/messenger-api";
import {userInfo} from "../../../../../common/states/common";
import {InfiniteScrollWrapper} from "../../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";
import classnames from "classnames"
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import {getRenderableContentFromMessage} from "../../../../../common/utils/editor-utils";
import {StatusAvatar} from "../../../../common/status-avatar/status-avatar";
import {WithUserStatus} from "../../../../common/user-statuts-subcriber/user-status-subscriber";
import {messageWidgetController} from "../../create-message-widget/create-message-widget";
import {Emoji} from "emoji-mart";
import {isImageFile} from "../../../../../common/utils/file-upload-utils";
import { CALL_TYPES } from '../../../../../common/call-services/call-services';

export const chatBoxList = {}

export class ChatBoxList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chat_rooms: [],
            skip: 0,
            fetching: true
        }
        this.fetchUserChatRooms()
        chatBoxList.seen = crID => {
            let newChatRooms = this.state.chat_rooms.map(each => {
                return {
                    ...each,
                    is_seen: crID === each._id ? true : each.is_seen
                }
            })
            this.setState({chat_rooms: newChatRooms})
        }

    }

    fetchUserChatRooms = () => {
        return messengerApi.getUserChatRooms(userInfo.getState()._id, this.state.skip).then((chat_rooms) => {
            this.setState({
                chat_rooms: this.state.chat_rooms.concat(chat_rooms),
                skip: this.state.skip + 10,
                fetching: false
            })
        })

    }


    render() {
        let {chat_rooms, fetching} = this.state;

        return (

            <div className=" nav-bar-dropdown">
                <div className="nbd-title">
                    Tin nhắn
                </div>
                <InfiniteScrollWrapper
                    className={"chat-box-list"}
                    onScrollTop={() => {

                        this.fetchUserChatRooms();

                    }}


                >
                    {() => (
                        <div className="nbd-content">
                            {!chat_rooms.length ? (
                                <div className="empty-notify">
                                    Bạn chưa có tin nhắn nào
                                </div>
                            ) : chat_rooms.map(each => (
                                <div
                                    className={classnames("chat-room-box", {"unseen": !each.is_seen})}
                                    key={each._id}
                                    onClick={() => messageWidgetController.createNewChatBox({userID: each.contact._id})}
                                >
                                    <div className="avatar">
                                        <WithUserStatus
                                            userID={each.contact._id}
                                            status={{
                                                active: each.contact?.active,
                                                last_active_at: each.contact?.last_active_at
                                            }}
                                        >
                                            {(userStatus) => {

                                                return (
                                                    <StatusAvatar
                                                        user={each.contact}
                                                        active={userStatus.active}
                                                    />
                                                )
                                            }}

                                        </WithUserStatus>
                                    </div>
                                    <div className="content-wrapper">
                                        <div className="chat-room-name">
                                            {each.contact.nickname || each.contact.basic_info.username}
                                        </div>
                                        <div className="latest-message">

                                            {each.latest_message.is_deleted ? (
                                                <span className="deleted-msg">
                                           Tin nhắn đã bị xóa bỏ
                                        </span>
                                            ) : each.latest_message.emoji ? (
                                                <span className="emoji-message">
                                            <Emoji set={'facebook'}
                                                   emoji={each.latest_message.emoji}
                                                   skin={each.latest_message.emoji?.skin || 1}
                                                   size={20}

                                            />

                                        </span>
                                            ) : (
                                                <>

                                                    {each.latest_message.call_info ? (
                                                        <span>Cuộc gọi {each.latest_message.call_info.call_type === CALL_TYPES.VIDEO ? "Video" : "Thoại"}</span>
                                                    ) : each.latest_message.file ? (
                                                        <span>{each.latest_message.sentBy === userInfo.getState()._id && "Bạn"} đã gửi một {isImageFile(each.latest_message.file.name) ? "ảnh" : "file"}</span>
                                                    ) : (
                                                        <span>{each.latest_message.sentBy === userInfo.getState()._id && "Bạn:"} {getRenderableContentFromMessage(each.latest_message)}</span>
                                                    )}
                                                </>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            ))}
                            {fetching && (
                                <SkeletonTheme color={"#e3e3e3"}
                                               highlightColor={"#ebebeb"}>
                                    <div className={classnames("chat-room-box")}>

                                        <div className="avatar">
                                            <Skeleton count={1} height={50} width={50} duration={1}
                                                      circle={true}/>
                                        </div>
                                        <div className="content-wrapper">
                                            <div className="chat-room-name">
                                                <Skeleton count={1} height={24} width={100} duration={1}/>
                                            </div>
                                            <div className="latest-message">
                                                <Skeleton count={1} height={20} width={200} duration={1}/>
                                            </div>
                                        </div>


                                    </div>
                                </SkeletonTheme>
                            )}
                        </div>
                    )}
                </InfiniteScrollWrapper>
            </div>

        );
    }
}
