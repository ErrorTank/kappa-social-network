import React, {Component} from 'react';
import {createNotificationRegistry} from "./float-top-notification";

export class BottomNotification extends Component {
    constructor(props){
        super(props);
        this.timeout = this.createTimeout();
    }

    createTimeout = () => setTimeout(() => {
        this.props.onClose();
    }, this.props.timeout);

    render() {
        let {content, onClose} = this.props;
        return (
            <div className="bottom-notification"

            >
                <div className="bn-content"
                     onMouseEnter={() => clearTimeout(this.timeout)}
                     onMouseLeave={() => {
                         this.timeout = this.createTimeout()
                     }}
                >
                    {content}
                    <i className="fas fa-times close-noti"
                       onClick={onClose}
                    />
                </div>

            </div>
        )
    }
}
export const bottomNotification = createNotificationRegistry({timeout: 50000, component: BottomNotification, className: "bottom-notification-registry"});



