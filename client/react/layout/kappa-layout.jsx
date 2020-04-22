import React, {Component} from 'react';
import {KComponent} from "../common/k-component";
import {authenCache} from "../../common/cache/authen-cache";
import {AuthenLayout} from "./authen-layout/authen-layout";
import {GuestLayout} from "./guest-layout/guest-layout";
import {withRouter} from "react-router";
import {userInfo} from "../../common/states/common";

class KappaLayout extends KComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.onUnmount(userInfo.onChange((nextState, oldState) => {
          this.forceUpdate();
          if(!nextState || !oldState){
              this.forceUpdate();
          }
        }));
    }
    render() {
        let Layout = authenCache.getAuthen() ? AuthenLayout : GuestLayout;
        return (
            <Layout>
                {props => this.props.children(props)}
            </Layout>
        );
    }
}
export const WithRouterKappaLayout = withRouter(KappaLayout)