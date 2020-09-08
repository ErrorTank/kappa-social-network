import React from "react"

import {CSSTransition, TransitionGroup} from "react-transition-group";
import remove from "lodash/remove";
import classnames from "classnames"


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



export const createNotificationRegistry = ({timeout, component, className}) => {

    let notificationActions = {};

    let Registry = () => (
        <NotificationRegistry
            actions={notificationActions}
            timeout={timeout}
            component={component}
            className={className}
        />
    );
    return {
        Registry,
        actions: notificationActions
    }


};

export const topFloatNotifications = createNotificationRegistry({timeout: 5000, component: FloatTopNotification, className: "top-float-notification-registry"});

export class NotificationRegistry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stack: []
        };


        props.actions.push = (options) => {

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
        const {timeout, component: Component, className} = this.props;

        return (
            <div className={classnames("notification-registry", className)}>
                <TransitionGroup>
                    {stack.map((n, i) => (
                        <CSSTransition
                            key={i}
                            timeout={300}
                            classNames={"fade"}
                        >
                            <Component
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



