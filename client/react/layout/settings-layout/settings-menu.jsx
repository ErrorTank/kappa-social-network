import React from 'react';
import classnames from "classnames";
import {customHistory} from "../../routes/routes";

const items = [
    {
        icon: <i className="fas fa-bell"></i>,
        label: "Thông báo",
        url: "/settings/general"
    },
    {
        icon: <i className="fas fa-ban"></i>,
        label: "Danh sách chặn",
        url: "/settings/blocked"
    },
    {
        icon: <i className="fas fa-lock"></i>,
        label: "Bảo mật",
        url: "/settings/security"
    },
]

export const SettingsMenu = ({currentUrl}) => {

    return (
        <div className="settings-menu white-box">
            <div className="sm-title">
                Cài đặt
            </div>
            <div className="sm-body">
                {items.map((each, i) => (
                    <div className={classnames("sm-item", {active: each.url === currentUrl})} key={i} onClick={() => customHistory.push(each.url)}>
                        {each.icon}
                        <span> {each.label}</span>
                        <i className="fal fa-angle-right sub-icon"></i>
                    </div>
                ))}
            </div>
        </div>
    );
};

