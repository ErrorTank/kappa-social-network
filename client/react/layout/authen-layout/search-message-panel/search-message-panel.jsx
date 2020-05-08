import React, {Component} from 'react';
import classnames from "classnames";
import FloatBottomWidget from "../float-bottom-widget/float-bottom-widget";
import {MessageBoxLayout} from "../message-box-layout/message-box-layout";
import {messageWidgetController} from "../create-message-widget/create-message-widget";
import {SearchMessageBox} from "./search-message-box/search-message-box";

export let searchMessageWidgetController = {};

export class SearchMessagePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearchPanel: false,
        };
        searchMessageWidgetController = {
            open: () => {
                messageWidgetController.close();
                this.setState({showSearchPanel: true});
            },
            close: () => {
                this.setState({showSearchPanel: false});
            }
        }
    }

    createNewChatRoom = () => {

    };


    render() {
        let {showSearchPanel} = this.state;
        let {darkMode} = this.props;
        return (

            <FloatBottomWidget
                className={classnames("search-message-panel", {darkMode})}
                renderSide={() => null}
                renderBox={() => {
                    return showSearchPanel ? (
                        <MessageBoxLayout
                            renderHeader={() => (
                                <div className="message-widget-header search-message-header">
                                    <div className="search-message-title left-panel">
                                        Tìm kiếm hội thoại
                                    </div>
                                    <div className="right-panel">
                                        <div className="actions">
                                            <div className="icon-wrapper" onClick={() => this.setState({showSearchPanel: false})}>
                                                <i className="fal fa-times"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            renderBody={() => (
                                <SearchMessageBox/>
                            )}
                        />
                    ) : null
                }}

            />
        );
    }
}
