import React, {Component} from 'react';
import {KComponent} from "../common/k-component";
import {authenCache} from "../../common/cache/authen-cache";
import {AuthenLayout} from "./authen-layout/authen-layout";
import {GuestLayout} from "./guest-layout/guest-layout";
import {withRouter} from "react-router";
import {userInfo} from "../../common/states/common";
import {ThemeContext} from "../context/theme-context";

class KappaLayout extends KComponent {
    constructor(props) {
        super(props);

        this.onUnmount(userInfo.onChange((nextState, oldState) => {
            if(!nextState || !oldState){
                this.forceUpdate();
            }
            this.setState({darkMode: nextState.dark_mode === false});

        }));
    }
    render() {
        let Layout = authenCache.getAuthen() ? AuthenLayout : GuestLayout;
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <Layout darkMode={darkMode}>
                        {props => this.props.children(props)}
                    </Layout>
                )}

            </ThemeContext.Consumer>
        );
    }
}
export const WithRouterKappaLayout = withRouter(KappaLayout)