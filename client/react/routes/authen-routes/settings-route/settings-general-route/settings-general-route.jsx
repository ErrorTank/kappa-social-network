import React, {Component} from 'react';
import {PageTitle} from "../../../../common/page-title/page-title";

class SettingsGeneralRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {},
            loading: true
        }
    }
    render() {

        return (
            <PageTitle
                title={`Cài đặt thông báo`}
            >
                <div className="settings-general-route settings-route white-box">
                    <div className="sr-title">
                        Cài đặt thông báo
                    </div>
                    <div className="sr-body">

                    </div>
                </div>
            </PageTitle>
        );
    }
}

export default SettingsGeneralRoute;