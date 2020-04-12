import React, {Component} from 'react';

export class GuestLayout extends Component {
    render() {
        return (
            <div className="guest-layout">
                {this.props.children()}
            </div>
        );
    }
}
