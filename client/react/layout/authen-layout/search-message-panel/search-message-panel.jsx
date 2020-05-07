import React, {Component} from 'react';
import classnames from "classnames";
import FloatBottomWidget from "../float-bottom-widget/float-bottom-widget";
import {MessageBoxLayout} from "../message-box-layout/message-box-layout";

export const searchMessageWidgetController = {};

export class SearchMessagePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearchPanel: false,
        };
        searchMessageWidgetController.open = () => {
            this.setState({showSearchPanel: true});
        };
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
                            renderHeader={() => null}
                            renderBody={() => null}
                        />
                    ) : null
                }}

            />
        );
    }
}
