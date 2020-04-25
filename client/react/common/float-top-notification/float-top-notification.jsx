import React from "react"

import {CSSTransition, TransitionGroup} from "react-transition-group";
import remove from "lodash/remove";

export const topFloatNotifications = {};

export class TopFloatNotificationRegistry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stack: []
        };


        topFloatNotifications.push = (options) => {

            let notiOptions = {
                options,
                resolve: null
            };

            let {stack} = this.state;
            this.setState({
                stack: stack.concat([notiOptions])
            });

            return new Promise((resolve) => {
                notiOptions.resolve = resolve;
            });
        };
    }

    removeNotification(notification) {
        remove(this.state.stack, notification);
        notification.resolve();
        this.forceUpdate();
    }

    render() {
        const {stack} = this.state;
        const {timeout} = this.props;

        return (
            <div className="float-top-notifications">
                <TransitionGroup>
                    {stack.map((n, i) => (
                        <CSSTransition
                            key={i}
                            timeout={300}
                            classNames={"fade"}
                        >
                            <FloatTopNotification
                                onClose={() => this.removeNotification(n)}
                                timeout={timeout}
                                content={n.options.content}
                            />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </div>

        );
    }
}

class FloatTopNotification extends React.Component{
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
            <div className="float-top-notification"

            >
                <div className="ftn-content"
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



