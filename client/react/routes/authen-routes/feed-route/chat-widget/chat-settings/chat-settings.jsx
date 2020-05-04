import React, {Component} from 'react';
import {Dropdownable} from "../../../../../common/dropdownable/dropdownable";

export class ChatSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let {turn_off_active} = this.props;
        let settings = [
            {
                icon: <i className="fal fa-do-not-enter"></i>,
                label: "Quản lý chặn",
                onClick: () => {

                }
            },{
                icon: <i className="fal fa-sliders-h"></i>,
                label: "Cài đặt trạng thái",
                onClick: () => {

                }
            },
        ];
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
                                {settings.map((each, i) => (
                                    <div className="setting-row" key={i}>
                                        {each.icon}
                                        <p>{each.label}</p>
                                    </div>
                                ))}
                            </div>

                        )}
                    />

                </div>
            </div>
        );
    }
}
