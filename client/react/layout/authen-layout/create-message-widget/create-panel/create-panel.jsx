import React, {Component} from 'react';
import {utilityApi} from "../../../../../api/common/utilities-api";
import {ThemeContext} from "../../../../context/theme-context";
import classnames from "classnames";
import {AsyncMultipleSelect} from "../../../../common/multiple-select/async-multiple-select";
import {generateGroupChatName} from "../../../../../common/utils/common";
import {StatusAvatar} from "../../../../common/status-avatar/status-avatar";
import {GroupChatAvatar} from "../../../../common/group-chat-avatar/group-chat-avatar";
import {Avatar} from "../../../../common/avatar/avatar";

export class CreatePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            values: []
        };
    }

    openMessageBox = (item) => {

    };

    handleOpenChatBox = () => {
        if(this.state.values.length === 1){
            let userID = this.state.values[0]._id;
            this.setState({values: []});
            this.props.onCreate(userID);
        }
    };


    render() {
        let {results, values} = this.state;
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <div className={classnames("create-panel", {darkMode})}>
                        <div className="search-box">
                            <div className="search-label">
                                Đến:
                            </div>
                            <AsyncMultipleSelect
                                deleteFilterFunc={(each, item) => each._id !== item._id}
                                className={"create-panel-input"}
                                addCondition={item => item.basic_info.username}
                                onSelectItem={item => !item.basic_info.username && this.openMessageBox(item)}
                                focus={true}
                                onChange={values => this.setState({values})}
                                displayTagAs={item => item.basic_info.username}
                                displayAs={item => (
                                    <div className="dialog-display">
                                        <div className="user-avatar">
                                            {item.basic_info?.username ? (
                                                <Avatar
                                                    user={item}
                                                />
                                            ) : item.is_group_chat ? (
                                                <GroupChatAvatar
                                                    users={item.users}
                                                />
                                            ) : (
                                                <Avatar
                                                    user={item}
                                                    getName={item => item.basic_info.name}
                                                />
                                            )}

                                        </div>
                                        <p className="username">{item.basic_info?.username || (item.is_group_chat ? generateGroupChatName(item) : item.basic_info.name)}</p>

                                    </div>
                                )}
                                values={values}
                                list={results}
                                listKey={item => item._id}
                                tagKey={(item) => item._id}
                                fetchOnMount={true}
                                showSummary={false}
                                isPicked={item => values.find(each => each._id === item._id)}
                                api={({filter}) => utilityApi.searchDialogsForCreateByKeyword(filter.keyword)
                                    .then((results) => this.setState({results}))}
                            />
                        </div>
                        <div className="actions">
                            <button className="btn btn-common-primary" disabled={!values.length}
                                    onClick={this.handleOpenChatBox}>Tạo phòng chat
                            </button>
                        </div>
                    </div>
                )}

            </ThemeContext.Consumer>
        );
    }
}
