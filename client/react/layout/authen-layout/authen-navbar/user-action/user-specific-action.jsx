import React, {Component} from 'react';
import {Avatar} from "../../../../common/avatar/avatar";
import {userInfo} from "../../../../../common/states/common";
import {clearAuthenticateUserSession} from "../../../../../common/app-services";
import {customHistory} from "../../../../routes/routes";
import {SwitchBtn} from "../../../../common/switch/switch-btn";
import {userApi} from "../../../../../api/common/user-api";

export class UserSpecificAction extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let user = userInfo.getState();
        const actions = [
            {
                icon: <i className="fas fa-cog"></i>,
                label: "Cài đặt",

            }, {
                icon: <i className="far fa-window"></i>,
                label: "Ưu tiên hiển thị",

            },{
                icon: <i className="fal fa-flag"></i>,
                label: "Quản lý trang",

            },{
                icon: <i className="fas fa-moon"></i>,

                customRender: () => (
                    <div className="night-mode">
                        Chế độ đêm
                        <SwitchBtn
                            className={"night-mode-toggle"}
                            value={this.props.darkMode}
                            onToggle={value => {
                                userApi.toggleDarkMode({value})
                                    .then((data) => {
                                        userInfo.setState(data)
                                    });

                            }}
                        />
                    </div>

                )

            },  {
                icon: <i className="fas fa-sign-out-alt"></i>,
                label: "Đăng xuất",
                onClick: () => {
                    clearAuthenticateUserSession().then(() => customHistory.push("/"));
                }
            }
        ];
        return (
            <div className="user-specific-action nav-dropdown">
                <div className="nav-dropdown-row profile-navigator">
                    <Avatar
                        user={user}

                        className={"nav-dropdown-avatar"}
                    />
                    <p className="username">{user.basic_info.username}</p>
                    <p className="sub">Trang cá nhân</p>
                </div>
                <div className="separate">

                </div>
                {actions.map(each => (
                    <div className={"nav-dropdown-row"} key={each.label} onClick={each.onClick}>
                        <div className="icon-wrapper">
                            {each.icon}
                        </div>
                        <div className="content">
                            {each.customRender ? each.customRender() : each.label}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}
