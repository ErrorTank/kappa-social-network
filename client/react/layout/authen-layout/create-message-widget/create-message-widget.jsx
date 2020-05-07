import React, {Component} from 'react';
import classnames from "classnames";
import {CreatePanel} from "./create-panel/create-panel";
import FloatBottomWidget from "../float-bottom-widget/float-bottom-widget";
import {MessageBoxLayout} from "../message-box-layout/message-box-layout";
import {Tooltip} from "../../../common/tooltip/tooltip";

export const messageWidgetController = {};

export class CreateMessageWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreatePanel: false,
        };
        // messageWidgetController.open = () => {
        //     this.setState({showCreatePanel: true});
        // };
    }

    createNewChatRoom = () => {

    };


    render() {
        let {showCreatePanel} = this.state;
        let {darkMode} = this.props;
        return (

            <FloatBottomWidget
                className={classnames("create-message-widget", {darkMode})}
                renderSide={() => (
                    <div className="cmw-side">
                        <div className="cmw-round-stack">
                            <Tooltip
                                position={"left"}
                                text={() => "Tạo hội thoại"}
                            >
                                <div className="cmw-toggle round"
                                     onClick={e => {
                                         e.stopPropagation();
                                         this.setState({showCreatePanel: !showCreatePanel});
                                     }}
                                >
                                    <i className="fas fa-comment-plus"></i>
                                </div>
                            </Tooltip>
                        </div>

                    </div>

                )}
                renderBox={() => {
                    return showCreatePanel ? (
                        <MessageBoxLayout
                            renderHeader={() => null}
                            renderBody={() => null}
                        />
                    ) : null
                }}

            />
        );
    }
}
