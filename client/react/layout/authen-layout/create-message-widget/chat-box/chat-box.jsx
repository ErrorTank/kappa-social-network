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
                                <div className="icon-wrapper" onClick={onClose}>
                                    <i className="fal fa-times"></i>
                                </div>
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
