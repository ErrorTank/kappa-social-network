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


class App extends React.Component {
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
                {/*cc*/}
                {/*{isError ? <Redirect to={{pathname: "/"}}/> : (*/}
                {/*    <CustomSwitch>*/}



                {/*    </CustomSwitch>*/}
                {/*)}*/}

            </Suspense>

        )
    };
}

export class MainRoute extends React.Component {
    constructor(props) {
        super(props);
    };


    render() {

        return (
            <div id="main-route">
                <Router
                    history={customHistory}
                >
                    <Route component={App}/>
                </Router>

                <ModalsRegistry/>
            </div>
        );
    }
}