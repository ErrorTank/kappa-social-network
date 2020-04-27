import React, {Component} from 'react';
import classnames from "classnames";
import {getNamePrefix} from "../../../../../common/utils/common";
import {KComponent} from "../../../../common/k-component";
import {userInfo} from "../../../../../common/states/common";
import {ClickOutside} from "../../../../common/click-outside/click-outside";
import {UserSpecificAction} from "./user-specific-action";

class UserActionDropdownable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    render() {
        let {toggleRender, dropdownRender} = this.props;
        return (
            <ClickOutside onClickOut={() => this.setState({show: false})}>
                <div className="user-action-dropdownable">
                    <div className={classnames("toggle", {active: this.state.show})}
                         onClick={() => this.setState({show: !this.state.show})}>
                        {toggleRender()}
                    </div>
                    {this.state.show && (

                        <div className="dropdown">
                            {dropdownRender()}
                        </div>


                    )}
                </div>
            </ClickOutside>
        )
    }
}

export class UserAction extends KComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let user = userInfo.getState();
        console.log(user)
        return (
            <div className="user-action">
                <UserActionDropdownable
                    toggleRender={() => (

                            <div className="avatar-wrapper">
                                {user.avatar ? (
                                    <img src={user.avatar}/>

                                ) : (
                                    <div className="avatar-holder">
                                        <span>{getNamePrefix(user.basic_info.username)}</span>
                                    </div>
                                )}
                            </div>
                    )}
                />
                <UserActionDropdownable
                    toggleRender={() => (
                        <div className="circle-action">
                            <i className="fas fa-comment"></i>
                        </div>

                    )}

                />
                <UserActionDropdownable
                    toggleRender={() => (
                        <div className="circle-action">
                            <i className="fas fa-bell"></i>
                        </div>
                    )}
                />
                <UserActionDropdownable
                    toggleRender={() => (

                        <div className="circle-action">
                            <i className="fas fa-caret-down"></i>
                        </div>

                    )}
                    dropdownRender={() => (
                        <UserSpecificAction/>
                    )}
                />
            </div>
        );
    }
}
