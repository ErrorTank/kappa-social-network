import React, {Component} from 'react';
import ReactDOM from "react-dom"
import {Message} from "./message";
import {LoadingInline} from "../../../../../common/loading-inline/loading-inline";
import classnames from "classnames"
import {userInfo} from "../../../../../../common/states/common";
import {InfiniteScrollWrapper} from "../../../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";
import {Avatar} from "../../../../../common/avatar/avatar";
import {userApi} from "../../../../../../api/common/user-api";
import {checkElemInContainerView} from "../../../../../../common/utils/dom-utils";
import {messengerIO} from "../../../../../../socket/sockets";
import {ThreeDotLoading} from "../../../../../common/3-dot-loading/3-dot-loading";

export let messagesContainerUtilities = {};


class ReceiverInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null
        };
        let receiverID = props.chatRoom.involve_person.find(each => each.related !== userInfo.getState()._id).related;
        userApi.getUserBasicInfo(receiverID).then((info) => {
            this.setState({info})
        })

    };

    render() {
        return (
            <div className="receiver-info">
                {this.state.info && (
                    <>
                        <Avatar user={this.state.info}/>
                        <div className="username">
                            Bắt đầu trò chuyện với <br/> <span
                            className="high-light">{this.state.info.basic_info.username}</span>
                        </div>
                    </>
                )}

            </div>
        );
    }
}

export default MessageSection;

export class MessageSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingMessages: true,
            unSeenCount: 0,
            typing: []
        }
        messagesContainerUtilities = {
            createScrollLatest: (forceScroll = false) => {
                return forceScroll  ? this.scrollToBottom :this.isBottom() ? this.scrollToBottom : () => null
            },
            increaseUnSeenCount: () => {
                if(!this.isBottom()){
                    this.setState({unSeenCount: this.state.unSeenCount + 1})
                }


            }
        }
        this.io = messengerIO.getIOInstance();
        this.io.on("user-typing", ({user}) => {
            let isBottom = this.isBottom();
            console.log(isBottom)
            if(!this.state.typing.find(each => each._id === user._id)){
                this.setState({typing: this.state.typing.concat(user)}, () => {
                    isBottom && setTimeout(() => this.scrollToBottom())

                });
            }
        })
        this.io.on("user-typing-done", ({user}) => {
            let isBottom = this.isBottom();
            this.setState({typing: this.state.typing.filter(each => each._id !== user._id)}, () => {
                isBottom && setTimeout(() => this.scrollToBottom())
            });
        })
    }

    componentWillUnmount() {
        this.io.off("user-typing-done");
        this.io.off("user-typing");
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.chatRoomID && nextProps.chatRoomID !== this.props.chatRoomID) {
            let isBottom = this.isBottom();
            this.loadMessages(nextProps.chatRoomID).then(() =>  isBottom && setTimeout(() => this.scrollToBottom()));
        }
        // if(nextProps.messages.length !== this.props.messages.length){
        //     setTimeout(() => {
        //         let elem = ReactDOM.findDOMNode(this);
        //
        //         this.setState({scrollHeight: elem.scrollHeight})
        //     })
        // }
    }


    scrollToBottom = () => {
        let elem = ReactDOM.findDOMNode(this);
        elem.scrollTop = elem.scrollHeight;
        this.setState({onScroll: false, unseenCount: 0});
    }

    isBottom = () => {
        let elem = ReactDOM.findDOMNode(this);

        return elem ? elem.scrollTop + elem.clientHeight >= elem.scrollHeight : true;
    }



    loadMessages = (chatRoomID) => {
        this.setState({loadingMessages: true});
        return this.props.loadMessages(chatRoomID).then(() => {
            this.setState({loadingMessages: false});


        });
    }

    getMessagePositionState = (messages, index) => {
        let previous = messages[index - 1];
        let after = messages[index + 1];
        let current = messages[index]

        if ((previous?.sentBy._id !== current.sentBy._id) && (after?.sentBy._id !== current.sentBy._id)) {
            return "single";
        }
        if ((previous?.sentBy._id === current.sentBy._id) && (after?.sentBy._id === current.sentBy._id)) {
            return "middle"
        }
        if (previous?.sentBy._id !== current.sentBy._id) {
            return "head"
        }
        return "tail";
    }

    resetCount = (childElem) => {
        if (checkElemInContainerView(ReactDOM.findDOMNode(this), childElem)) {
            this.setState({unseenCount: this.state.unSeenCount - 1});
        }
    };

    render() {
        let {messages} = this.props;
        let userID = userInfo.getState()._id;
        let userMessages = messages.filter(each => each.sentBy._id === userID);
        let lastUserMessage = userMessages[userMessages.length - 1];
        let firstMessage = messages[0]
        console.log(this.state.typing)
        return (
            <>

                <InfiniteScrollWrapper
                    onScrollTop={() => {
                        if (!(firstMessage && firstMessage.is_init)) {
                            let oldScrollHeight = ReactDOM.findDOMNode(this).scrollHeight;
                            this.loadMessages(this.props.chatRoomID).then(() => {
                                setTimeout(() => {
                                    let elemClone = ReactDOM.findDOMNode(this);
                                    elemClone.scrollTop = elemClone.scrollHeight - oldScrollHeight;
                                })
                            })
                        }

                    }}
                    onScrollBottom={() => this.setState({unSeenCount: 0})}
                    onScroll={() => {

                    }}
                >

                    <div className="message-section">
                        {!this.isBottom() && this.state.unSeenCount !== 0 && (
                            <div className="new-message-notify" onClick={() =>{
                                this.scrollToBottom();
                            }}>
                                Bạn có <span className="high-light">{this.state.unSeenCount}</span> tin nhắn mới <span style={{marginLeft: "5px"}} className="high-light"><i
                                className="far fa-arrow-down"></i></span>
                            </div>
                        )}
                        {this.state.loadingMessages && (
                            <div className={classnames("loading-wrapper", {expand: messages.length === 0})}>
                                <LoadingInline/>
                            </div>
                        )}
                        <div className="messages">

                            {firstMessage && firstMessage.is_init && !this.props.chatRoom?.is_group_chat && (
                                <ReceiverInfo
                                    chatRoom={this.props.chatRoom}
                                />
                            )}

                            {messages.map((each, index) => {
                                let position = this.getMessagePositionState(messages, index)
                                return each.is_init ? null : (
                                    <Message

                                        position={position}
                                        message={each}
                                        isUserLastMessage={each._id === lastUserMessage?._id}
                                        key={each._id}
                                        haveAvatar={position === "single" || position === "tail"}
                                    />
                                )
                            })}
                            {this.state.typing.map((each) => (
                                <div className="typing" key={each._id}>
                                    <div className="avatar">
                                        <Avatar
                                            user={each}
                                        />
                                    </div>
                                    <div className="message-holder">
                                        <ThreeDotLoading/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </InfiniteScrollWrapper>
            </>
        );
    }
}
