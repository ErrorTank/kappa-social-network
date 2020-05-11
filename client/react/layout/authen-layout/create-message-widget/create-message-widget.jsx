import React, {Component} from 'react';
import classnames from "classnames";
import {CreatePanel} from "./create-panel/create-panel";
import FloatBottomWidget from "../float-bottom-widget/float-bottom-widget";
import {MessageBoxLayout} from "../message-box-layout/message-box-layout";
import {Tooltip} from "../../../common/tooltip/tooltip";
import {searchMessageWidgetController} from "../search-message-panel/search-message-panel";

export let messageWidgetController = {};

export class CreateMessageWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreatePanel: false,
        };
        messageWidgetController = {
            open: () => {
                searchMessageWidgetController.close();
                this.setState({showCreatePanel: true});
            },
            close: () => {
                this.setState({showCreatePanel: false});
            }
        };
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
                                         searchMessageWidgetController.close();
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
                            renderHeader={() => (
                                <div className="message-widget-header search-message-header">
                                    <div className="search-message-title left-panel">
                                        Tạo cuộc hội thoại
                                    </div>
                                    <div className="right-panel">
                                        <div className="actions">
                                            <div className="icon-wrapper" onClick={() => this.setState({showCreatePanel: false})}>
                                                <i className="fal fa-times"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            renderBody={() => (
                                <CreatePanel

                                />
                            )}
                        />
                    ) : null
                }}

            />
        );
    }
}
