import React, {Component} from 'react';
import {MessageBoxLayout} from "../../message-box-layout/message-box-layout";
import {MessageSection} from "./message-section/message-section";
import {MessageUtilities} from "./message-utilities/message-utilities";
import classnames from "classnames"
import {Tooltip} from "../../../../common/tooltip/tooltip";

export class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    startVideoCall = () => {

    };

    startVoiceCall = () => {

    };

    headerActions = [
        {
            icon: <i className="fas fa-video"></i>,
            onClick: () => this.startVideoCall(),
            toolTipContent: "Bắt đầu gọi video",
            className: "small-icon"
        },
        {
            icon: <i className="fas fa-phone-alt"></i>,
            onClick: () => this.startVoiceCall(),
            toolTipContent:  "Bắt đầu gọi thoại",
            className: "small-icon"
        },
        {
            icon: <i className="far fa-window-minimize"></i>,
            onClick: () => this.props.onMinimize(),
            toolTipContent: "Thu nhỏ tab",
            className: "small-icon minimize"
        },
        {
            icon: <i className="fal fa-times"></i>,
            onClick: () => this.props.onClose(),
            toolTipContent: "Đóng tab"
        },
    ];

    render() {
        let {onClose, active} = this.props;
        console.log(active)
        return (
            <MessageBoxLayout
                className={classnames({hide: !active})}
                renderHeader={() => (
                    <div className="chat-box-header message-widget-header">
                        <div className="left-panel">
                            This is chat
                        </div>
                        <div className="right-panel">
                            <div className="actions">
                                {this.headerActions.map((each, i) => (
                                    <Tooltip
                                        text={() => each.toolTipContent}
                                        position={"top"}
                                        key={i}
                                    >
                                        <div className={classnames("icon-wrapper", each.className)} onClick={each.onClick} >
                                            {each.icon}
                                        </div>
                                    </Tooltip>
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
