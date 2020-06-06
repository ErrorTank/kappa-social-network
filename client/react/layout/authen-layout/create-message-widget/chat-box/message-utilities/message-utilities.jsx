import React, {Component} from 'react';
import {Tooltip} from "../../../../../common/tooltip/tooltip";


export class MessageUtilities extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="message-utilities">
                <div className="actions-container">
                    <Tooltip text={() => "Gắn ảnh hoặc video"} position={"top"}>
                        <div className="icon-wrapper">
                            <i className="far fa-photo-video"></i>
                        </div>
                    </Tooltip>
                    <Tooltip text={() => "Đính kèm file"} position={"top"}>
                        <div className="icon-wrapper">
                            <i className="far fa-paperclip"></i>
                        </div>
                    </Tooltip>
                    <div className="chat-input-wrapper">

                    </div>
                    <Tooltip text={() => "Gửi"} position={"top"}>
                        <div className="icon-wrapper react">
                            <i className="fas fa-thumbs-up"></i>
                        </div>
                    </Tooltip>
                </div>
            </div>
        );
    }
}
