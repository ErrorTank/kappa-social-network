

import React, {Component} from 'react';
import {AsyncMultipleSelect} from "../../multiple-select/async-multiple-select";
import {Avatar} from "../../avatar/avatar";
import {GroupChatAvatar} from "../../group-chat-avatar/group-chat-avatar";
import {generateGroupChatName} from "../../../../common/utils/common";
import {utilityApi} from "../../../../api/common/utilities-api";

export class TagFriends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        }
    }

    render() {
        let {tagged, onTag} = this.props;
        let {results} = this.state;
        return (
            <div className="tag-friends">
                <AsyncMultipleSelect
                    className={"tag-friend-input"}
                    addCondition={item => item.basic_info.username}
                    focus={true}
                    onChange={values => onTag(values)}
                    displayTagAs={item => item.basic_info.username}
                    displayAs={item => (
                        <div className="friend-display">
                            <div className="user-avatar">
                                <Avatar
                                    user={item}
                                />

                            </div>
                            <p className="username">{item.basic_info?.username}</p>

                        </div>
                    )}
                    values={tagged}
                    deleteFilterFunc={(each, item) => each._id !== item._id}
                    list={results}
                    listKey={item => item._id}
                    tagKey={(item) => item._id}
                    fetchOnMount={true}
                    showSummary={false}
                    isPicked={item => tagged.find(each => each._id === item._id)}
                    api={({filter}) => utilityApi.searchFriends(filter.keyword).then(results => this.setState({results}))}
                />
            </div>
        );
    }
}



