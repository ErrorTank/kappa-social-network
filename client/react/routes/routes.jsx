import React, {lazy, Suspense} from "react";
import {Route, Router, Redirect} from "react-router-dom"
import {createBrowserHistory} from 'history';
import {ModalsRegistry} from "../common/modal/modals";

export const customHistory = createBrowserHistory();
import {AuthenRoute} from "./route-types/authen-route";
import {GuestRoute} from "./route-types/guest-route";
import {OverlayLoading} from "../common/overlay-loading";
import {delayLoad} from "../../common/utils/common";
import {RoleFilterRoute} from "./route-types/role-filter-route";
import {CustomSwitch} from "./route-types/custom-switch";
import {userInfo} from "../../common/states/common";
import {offlineApi} from "../../api/api";


class MainRoute extends React.Component {
    constructor(props) {
        super(props);
        offlineApi.get("/loz").then(s => console.log(s))
    };

    render() {
        const {location} = this.props;
        const isError = !!(
            location.state &&
            location.state.error
        );

        return (
            <Suspense fallback={<OverlayLoading/>}>
                {process.env.APP_URI}
                du ma may dasda
                {/*cc*/}
                {/*{isError ? <Redirect to={{pathname: "/"}}/> : (*/}
                {/*    <CustomSwitch>*/}



                {/*    </CustomSwitch>*/}
                {/*)}*/}

            </Suspense>

        )
    };
}

export class App extends React.Component {
    constructor(props) {
        super(props);
    };

    enableNotification = () => {

    };

    render() {

        return (
            <div className="app">
                {'Notification' in window && 'serviceWorker' in navigator && (
                    <div className="notification-prompt">
                        Kappa cần sự cho phép của bạn để <span onClick={this.enableNotification}>Gửi thông báo</span>
                    </div>
                )}
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