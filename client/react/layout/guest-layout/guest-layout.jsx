import React, {Component} from 'react';
import {GuestNavbar} from "./guest-navbar/guest-navbar";

export class GuestLayout extends Component {
    render() {
        return (
            <div className="guest-layout">
                <GuestNavbar/>
                {this.props.children()}
            </div>
        );
    }
}
