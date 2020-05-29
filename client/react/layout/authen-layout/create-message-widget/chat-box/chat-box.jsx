import React, {Component} from 'react';
import {MessageBoxLayout} from "../../message-box-layout/message-box-layout";
import {MessageSection} from "./message-section/message-section";
import {MessageUtilities} from "./message-utilities/message-utilities";

export class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    headerActions = [
        {
            icon: <i className="fas fa-video"></i>,
            onClick: () => this.props.onClose(),
            toolTipContent: () => "Bắt đầu gọi video"
        },
        {
            icon: <i className="fas fa-phone-alt"></i>,
            onClick: () => this.props.onClose(),
            toolTipContent: () => "Bắt đầu gọi thoại"
        },
        {
            icon: <i className="far fa-window-minimize"></i>,
            onClick: () => this.props.onClose(),
            toolTipContent: () => "Thu nhỏ tab"
        },
        {
            icon: <i className="fal fa-times"></i>,
            onClick: () => this.props.onClose(),
            toolTipContent: () => "Đóng tab"
        },
    ];

    render() {
        let {onClose} = this.props;
        return (
            <MessageBoxLayout
                renderHeader={() => (
                    <div className="chat-box-header message-widget-header">
                        <div className="left-panel">
                            This is chat
                        </div>
                        <div className="right-panel">
                            <div className="actions">
                                {this.headerActions.map((each, i) => (
                                    <div className="icon-wrapper" onClick={each.onClick} key={i}>
                                        {each.icon}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                renderBody={() => (
                    <div className="chat-box-body">
                        <MessageSection/>
                        <MessageUtilities/>
                    </div>
                )}
            />
        );
    }
}
