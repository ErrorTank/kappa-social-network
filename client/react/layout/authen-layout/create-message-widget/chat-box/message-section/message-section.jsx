import React, {Component} from 'react';
import {Message} from "./message";
import {LoadingInline} from "../../../../../common/loading-inline/loading-inline";
import classnames from "classnames"

export class MessageSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingMessages: true,

        }

    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.chatRoomID && nextProps.chatRoomID !== this.props.chatRoomID){
            this.loadMessages(nextProps.chatRoomID);
        }
    }

    loadMessages = (chatRoomID) => {
        this.setState({loadingMessages: true});
        this.props.loadMessages(chatRoomID).then(() => this.setState({loadingMessages: false}));
    }

    getMessagePositionState = (messages, index) => {
        let previous = messages[index - 1];
        let after = messages[index - 1];
        let current = messages[index]
        if((previous?.sentBy !== current.sentBy) && (after?.sentBy !== current.sentBy)){
            return "single";
        }
        if((previous?.sentBy === current.sentBy) && (after?.sentBy === current.sentBy)){
            return "middle"
        }
        if(previous?.sentBy !== current.sentBy){
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
