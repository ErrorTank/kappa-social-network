import React, {Component} from 'react';
import {Dropdownable} from "../../../../../common/dropdownable/dropdownable";
import classnames from "classnames"

export class ChatSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let {turn_off_active} = this.props;
        return (
            <div className="chat-settings">
                <div className="actions">
                    <div className="action">
                        <div className="icon-wrapper ">
                            <i className="fal fa-search"></i>
                        </div>
                    </div>

                    <Dropdownable
                        className={"chat-settings-dropdown action"}
                        toggle={() => (
                            <div className="icon-wrapper">
                                <i className="fal fa-ellipsis-h"></i>
                            </div>

                        )}
                        content={() => (
                            <div className={"chat-settings-dropdown-content"}>

                            </div>

                        )}
                    />

                </div>
            </div>
        );
    }
}
