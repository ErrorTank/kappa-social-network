import React, {Component} from 'react';
import {callServices} from "../../../../../common/call-services/call-services";
import {KComponent} from "../../../../common/k-component";

export class ToggleMinimize extends KComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.onUnmount(callServices.onChange((nextState, oldState) => {
            this.forceUpdate();

        }));
    }
    render() {
        let showMinimizeToggle = callServices.isCallTo(this.props.userInfo._id);
        return showMinimizeToggle ? (
            <div className={"toggle-minimize"}>
                <button className="btn btn-back" onClick={() => callServices.toggleMinimize()}>
                    Trờ lại cuộc gọi
                </button>
                <button className="btn btn-cancel">
                    Hủy cuộc gọi
                </button>
            </div>
        ) : null
    }
}
