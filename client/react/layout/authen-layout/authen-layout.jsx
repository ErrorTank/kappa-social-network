import React, {Component} from 'react';

export class AuthenLayout extends Component {
    render() {
        return (
            <div className="authen-layout">
                {this.props.children()}
            </div>
        );
    }
}
