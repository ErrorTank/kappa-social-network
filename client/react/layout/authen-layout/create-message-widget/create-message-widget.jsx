import React, {Component} from 'react';
import classnames from "classnames";
import {CreatePanel} from "./create-panel/create-panel";
import FloatBottomWidget from "../float-bottom-widget/float-bottom-widget";
import {MessageBoxLayout} from "../message-box-layout/message-box-layout";

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
                        <div className="cmw-toggle"
                             onClick={e => {
                                 e.stopPropagation();
                                 this.setState({showCreatePanel: !showCreatePanel});
                             }}
                        >
                            <i className="fas fa-comment-plus"></i>
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
