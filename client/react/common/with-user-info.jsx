import React, {Component} from 'react';
import {userInfo} from "../../common/states/common";
import {KComponent} from "./k-component";

export class WithUserInfo extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            user: userInfo.getState()
        }
        this.onUnmount(userInfo.onChange((nextState, oldState) => {
            if(props.neededUpdate(oldState, nextState)){
                this.setState({user: nextState})
            }

        }));
    }
    render() {
        return this.props.children({
            user: this.state.user
        })
    }
}

