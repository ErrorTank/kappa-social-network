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
import {GuestRoute} from "./route-types/guest-route/guest-route";
import {AuthenRoute} from "./route-types/authen-route/authen-route";
import {WithRouterKappaLayout} from "../layout/kappa-layout";
import {TopFloatNotificationRegistry} from "../common/float-top-notification/float-top-notification";
import {ThemeContext, ThemeController} from "../context/theme-context";

const FeedRoute = lazy(delayLoad(() => import("./authen-routes/feed-route/feed-route")));
const LoginRoute = lazy(delayLoad(() => import("./guest-routes/login-route/login-route")));
const ForgotPasswordRoute = lazy(delayLoad(() => import("./guest-routes/forgot-password-route/forgot-password-route")));
const AccountConfirmationRoute = lazy(delayLoad(() => import("./guest-routes/account-confirmation/account-confirmation")));
const ChangePasswordRoute = lazy(delayLoad(() => import("./guest-routes/change-password-route/change-password-route")));
const GlobalSearchResult = lazy(delayLoad(() => import("./authen-routes/global-search-result/global-search-result")));
export const NotificationStateContext = React.createContext();

class MainRoute extends React.Component {
    constructor(props) {
        super(props);
        // fetch("https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tinh_tp.json")
    };


    render() {

        return (
            <ThemeController>
                {({darkMode}) => (
                    <Suspense fallback={<OverlayLoading darkMode={darkMode}/>}>
                        <WithRouterKappaLayout>
                            {layoutProps => (
                                <CustomSwitch>
                                    <FlexibleRoute
                                        {...layoutProps}
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
                                    <AuthenRoute
                                        {...layoutProps}
                                        path={"/tim-kiem"}
                                        exact

                                        render={props => (
                                            <GlobalSearchResult

                                                {...props}
                                            />
                                        )}
                                    />
                                    <GuestRoute
                                        {...layoutProps}
                                        path={"/quen-mat-khau"}
                                        exact
                                        render={props => (
                                            <ForgotPasswordRoute

                                                {...props}
                                            />
                                        )}
                                    />
                                    <GuestRoute
                                        {...layoutProps}
                                        path={"/xac-thuc-tai-khoan"}
                                        exact
                                        render={props => (
                                            <AccountConfirmationRoute

                                                {...props}
                                            />
                                        )}
                                    />
                                    <GuestRoute
                                        {...layoutProps}
                                        path={"/doi-mat-khau"}
                                        exact
                                        render={props => (
                                            <ChangePasswordRoute

                                                {...props}
                                            />
                                        )}
                                    />
                                </CustomSwitch>
                            )}
                        </WithRouterKappaLayout>
                    </Suspense>
                )}
            </ThemeController>

        )
    };
}

class NotificationPrompt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

    };

    enableNotification = () => {
        Notification.requestPermission((result) => {
            console.log('User Choice', result);
            if (result !== 'granted') {
                console.log('No notification permission granted!');
            } else {
                // configurePushSub();
                this.props.onChange(false);
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
        return this.props.value ? (
            <div className="notification-prompt">
                Kappa cần sự cho phép của bạn để <span onClick={this.enableNotification}>Bật thông báo</span>.
            </div>
        ) : null;
    }
}

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showNotificationPrompt: 'Notification' in window && 'serviceWorker' in navigator && Notification.permission !== "granted"
        }

    };


    render() {

        return (
            <div className="app">

                <NotificationPrompt
                    value={this.state.showNotificationPrompt}
                    onChange={value => this.setState({showNotificationPrompt: value})}

                />
                <div id="main-route">
                    <TopFloatNotificationRegistry
                        timeout={5000}
                    />
                    <Router
                        history={customHistory}
                    >


                        <NotificationStateContext.Provider value={this.state.showNotificationPrompt}>
                            <MainRoute/>
                        </NotificationStateContext.Provider>
                        <ModalsRegistry/>
                    </Router>


                </div>
            </div>

        );
    }
}