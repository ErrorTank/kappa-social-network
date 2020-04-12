import React, {lazy, Suspense} from "react";
import {Route, Router, Redirect} from "react-router-dom"
import {createBrowserHistory} from 'history';
import {ModalsRegistry} from "../common/modal/modals";

export const customHistory = createBrowserHistory();
import {OverlayLoading} from "../common/overlay-loading";
import {delayLoad} from "../../common/utils/common";
import {CustomSwitch} from "./route-types/custom-switch";
import {userInfo} from "../../common/states/common";
import {offlineApi} from "../../api/api";
import {FlexibleRoute} from "./route-types/flexible-route";
import {authenCache} from "../../common/cache/authen-cache";
const FeedRoute = lazy(delayLoad(() => import("./authen-routes/feed-route/feed-route")));
const LoginRoute = lazy(delayLoad(() => import("./guest-routes/login-route/login-route")));

class MainRoute extends React.Component {
    constructor(props) {
        super(props);
        fetch("https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tinh_tp.json")
    };


    render() {
        const {location} = this.props;
        const isError = !!(
            location.state &&
            location.state.error
        );

        return (
            <Suspense fallback={<OverlayLoading/>}>
                <CustomSwitch>
                    <FlexibleRoute
                        path={"/"}
                        exact
                        render={props => !authenCache.getAuthen() ?
                            (
                                <LoginRoute
                                    {...props}
                                />
                            ) : (
                                <FeedRoute
                                    {...props}
                                />
                            )
                        }
                    />
                </CustomSwitch>

            </Suspense>

        )
    };
}

class NotificationPrompt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showNotificationPrompt: 'Notification' in window && 'serviceWorker' in navigator && Notification.permission !== "granted"
        }

    };

    enableNotification = () => {
        Notification.requestPermission((result) => {
            console.log('User Choice', result);
            if (result !== 'granted') {
                console.log('No notification permission granted!');
            } else {
                // configurePushSub();
                this.setState({showNotificationPrompt: false});
                let options = {
                    body: 'Các thông báo quan trọng của bạn sẽ được hiển thị ở đây.',
                    icon: '/assets/images/icons/app-icon-192x192.png',
                    dir: 'ltr',
                    lang: 'en-US',
                    vibrate: [100, 50, 200],
                    badge: '/assets/images/icons/app-icon-192x192.png',
                    tag: 'confirm-notification',
                    renotify: true
                };
                navigator.serviceWorker.ready
                    .then((swreg) => {
                        swreg.showNotification('Bật thông báo thành công!', options);
                    });
            }
        });
    };

    render() {
        return this.state.showNotificationPrompt ? (
            <div className="notification-prompt">
                Kappa cần sự cho phép của bạn để <span onClick={this.enableNotification}>Gửi thông báo</span>.
            </div>
        ) : null;
    }
}

export class App extends React.Component {
    constructor(props) {
        super(props);
    };


    render() {

        return (
            <div className="app">
                <NotificationPrompt/>
                <div id="main-route">
                    <Router
                        history={customHistory}
                    >
                        <Route component={MainRoute}/>
                    </Router>

                    <ModalsRegistry/>
                </div>
            </div>

        );
    }
}