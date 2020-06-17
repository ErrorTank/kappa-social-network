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
        this.props.loadSuggestion(chatRoomID).then(() => this.setState({loadingMessages: false}));
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
                    {messages.map((each, _id) => (
                        <Message
                            message={each}
                            key={_id}
                        />
                    ))}
                </div>
            </div>
        );
    }
}
