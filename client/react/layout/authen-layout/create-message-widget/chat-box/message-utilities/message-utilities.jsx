import React, {Component} from 'react';

export class MessageUtilities extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className="message-utilities">
                <div className="actions-container">
                    <div className="icon-wrapper">
                        <i className="far fa-photo-video"></i>
                    </div>
                    <div className="icon-wrapper">
                        <i className="far fa-paperclip"></i>
                    </div>
                    <div className="chat-input-wrapper">

                    </div>
                    <div className="icon-wrapper react">
                        <i className="fas fa-thumbs-up"></i>
                    </div>
                </div>
            </div>
        );
    }
}
