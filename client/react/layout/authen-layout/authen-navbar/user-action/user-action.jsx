import React, {Component} from 'react';
import classnames from "classnames";
import {getNamePrefix} from "../../../../../common/utils/common";
import {KComponent} from "../../../../common/k-component";
import {userInfo} from "../../../../../common/states/common";

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
            <div className="user-action-dropdownable">
                <div className={classnames("toggle", {active: this.state.show})} onClick={() => this.setState({show: true})}>
                    {toggleRender()}
                </div>
                {/*{this.state.show && (*/}
                {/*    <div className="dropdown">*/}
                {/*        {dropdownRender()}*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
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
                        <div className="user-specific-action">
                            <div className="avatar-wrapper">
                                {user.avatar ? (
                                    <img src={user.avatar}/>

                                ) : (
                                    <div className="avatar-holder">
                                        <span>{getNamePrefix(user.basic_info.username)}</span>
                                    </div>
                                )}
                            </div>
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
                />
            </div>
        );
    }
}
