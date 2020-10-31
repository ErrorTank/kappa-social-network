import React, {Component} from 'react';
import {PageTitle} from "../../../../common/page-title/page-title";
import {userApi} from "../../../../../api/common/user-api";
import {userInfo} from "../../../../../common/states/common";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {notificationSettings} from "../../../../../const/settings";
import {SwitchBtn} from "../../../../common/switch/switch-btn";

class SettingsGeneralRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: [],
            loading: true
        }
        userApi.getUserSettings(userInfo.getState()._id).then(({notification_settings}) => {
            this.setState({settings: notification_settings, loading: false})
        })
    }
    render() {
        let {settings, loading} = this.state;
        return (
            <PageTitle
                title={`Cài đặt thông báo`}
            >
                <div className="settings-general-route settings-route white-box">
                    <div className="sr-title">
                        Cài đặt thông báo
                    </div>
                    <div className="sr-body">
                        {loading ? (
                            <LoadingInline/>
                        ) : (
                            <div className="settings-container">
                                {notificationSettings.map(each => (
                                    <div className="notification-row" key={each.value}>
                                        <div className="nr-label">
                                            {each.label}
                                        </div>
                                        <div className="nr-action">
                                            <SwitchBtn
                                                value={!!settings.find(s => s === each.value)}
                                                onToggle={value => {
                                                    let newSettings = value ? settings.concat(each.value) : settings.filter(s => s !== each.value);

                                                    this.setState({settings: newSettings});
                                                    userApi.updateUserSettings(userInfo.getState()._id, {settings: newSettings})
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </PageTitle>
        );
    }
}

export default SettingsGeneralRoute;