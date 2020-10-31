import React, {Component} from 'react';
import {CommonLayout} from "../common-layout/common-layout";
import {SettingsMenu} from "./settings-menu";


export class SettingsLayout extends Component {

    render() {
        let {children, ...rest} = this.props;
        console.log(rest)
        return (
            <div className="settings-layout">
                <CommonLayout
                    extendMain={true}
                    haveLeftRender={false}
                    haveRightRender={false}
                    mainRender={() => (
                        <div className="settings-layout-wrapper common-container">
                            <div className="settings-left-panel">
                                <SettingsMenu
                                    currentUrl={rest.location.pathname}
                                />
                            </div>
                            <div className="settings-right-panel">
                                {children()}
                            </div>
                        </div>
                    )}
                />
            </div>
        );
    }
}

