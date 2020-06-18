import React, {Component} from 'react';
import ReactDOM from "react-dom"
import {Message} from "./message";
import {LoadingInline} from "../../../../../common/loading-inline/loading-inline";
import classnames from "classnames"

export let messagesContainerUtilities = {};

export class MessageSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingMessages: true,

        }
        messagesContainerUtilities = {
            scrollToLatest: this.scrollToLatest
        }


    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.chatRoomID && nextProps.chatRoomID !== this.props.chatRoomID){
            this.loadMessages(nextProps.chatRoomID);
        }
        if(nextProps.messages.length > this.props.messages.length){
            setTimeout(() => {
                this.scrollToLatest();
            })
        }
    }

    scrollToLatest = () => {
        let elem = ReactDOM.findDOMNode(this);
        elem.scrollTop = elem.scrollHeight;
    }

    loadMessages = (chatRoomID) => {
        this.setState({loadingMessages: true});
        this.props.loadMessages(chatRoomID).then(() => {
            this.setState({loadingMessages: false});
            this.scrollToLatest();

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
        return (
            <div className="message-section">
                {this.state.loadingMessages && (
                    <div className={classnames("loading-wrapper", {expand: messages.length === 0})}>
                        <LoadingInline/>
                    </div>
                )}
                <div className="messages">
                    <div className="receiver-info">

                    </div>
                    {messages.map((each, index) => {
                        let position = this.getMessagePositionState(messages, index)
                        return (
                            <Message
                                position={position}
                                message={each}
                                key={each._id}
                                haveAvatar={position === "single" || position === "tail"}
                            />
                        )
                    })}
                </div>
            </div>
        );
    }
}
