import React, {Component} from 'react';
import ReactDOM from "react-dom"
import {Message} from "./message";
import {LoadingInline} from "../../../../../common/loading-inline/loading-inline";
import classnames from "classnames"
import {userInfo} from "../../../../../../common/states/common";
import {InfiniteScrollWrapper} from "../../../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";
import {Avatar} from "../../../../../common/avatar/avatar";
import {userApi} from "../../../../../../api/common/user-api";

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
                            Bắt đầu trò chuyện với <br/> <span className="high-light">{this.state.info.basic_info.username}</span>
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
            onScroll: false
       }
        messagesContainerUtilities = {
            scrollToLatest: this.scrollToLatest
        }


    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.chatRoomID && nextProps.chatRoomID !== this.props.chatRoomID){
            this.loadMessages(nextProps.chatRoomID).then(() => this.scrollToLatest());
        }
        // if(nextProps.messages.length !== this.props.messages.length){
        //     setTimeout(() => {
        //         let elem = ReactDOM.findDOMNode(this);
        //
        //         this.setState({scrollHeight: elem.scrollHeight})
        //     })
        // }
    }


    scrollToLatest = () => {
        if(!this.state.onScroll){
            let elem = ReactDOM.findDOMNode(this);
            elem.scrollTop = elem.scrollHeight;
        }

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

        if((previous?.sentBy._id !== current.sentBy._id) && (after?.sentBy._id !== current.sentBy._id)){
            return "single";
        }
        if((previous?.sentBy._id === current.sentBy._id) && (after?.sentBy._id === current.sentBy._id)){
            return "middle"
        }
        if(previous?.sentBy._id !== current.sentBy._id){
            return "head"
        }
        return "tail";
    }

    render() {
        let {messages} = this.props;
        let userID = userInfo.getState()._id;
        let userMessages = messages.filter(each => each.sentBy._id === userID);
        let lastUserMessage = userMessages[userMessages.length - 1];
        let firstMessage = messages[0]

        return (
           <InfiniteScrollWrapper
               onScrollTop={() => {
                   if(!(firstMessage && firstMessage.is_init)){
                       let oldScrollHeight = ReactDOM.findDOMNode(this).scrollHeight;
                       this.loadMessages(this.props.chatRoomID).then(() => {
                           setTimeout(() => {
                               let elemClone = ReactDOM.findDOMNode(this);
                               elemClone.scrollTop = elemClone.scrollHeight - oldScrollHeight;
                           })
                       })
                   }

               }}
               onScrollBottom={() =>  this.setState({onScroll: false})}
               onScroll={() => {
                   if(!this.state.onScroll){
                       this.setState({onScroll: true});
                   }
               }}
           >
               <div className="message-section">
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
                           return each.is_init ? null :(
                               <Message
                                   position={position}
                                   message={each}
                                   isUserLastMessage={each._id === lastUserMessage?._id}
                                   key={each._id}
                                   haveAvatar={position === "single" || position === "tail"}
                               />
                           )
                       })}
                   </div>
               </div>
           </InfiniteScrollWrapper>
        );
    }
}
