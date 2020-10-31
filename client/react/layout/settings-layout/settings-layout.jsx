import React, {Component} from 'react';
import {CommonLayout} from "../common-layout/common-layout";


export class SettingsLayout extends Component {

    render() {
        let {children} = this.props;
        return (
            <div className="settings-layout">
                <CommonLayout
                    extendMain={true}
                    haveLeftRender={false}
                    haveRightRender={false}
                    mainRender={() => (
                        <div className="settings-layout-wrapper">
                            <div className="settings-left-panel">

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

