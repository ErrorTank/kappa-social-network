import React, {Component} from 'react';
import {StatusAvatar} from "../../../../../common/status-avatar/status-avatar";
import {formatMomentTimeRange, generateGroupChatName} from "../../../../../../common/utils/common";
import {GroupChatAvatar} from "../../../../../common/group-chat-avatar/group-chat-avatar";
import moment from "moment";
import classnames from "classnames";

export class GroupSection extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className={classnames("group-section", {darkMode: this.props.darkMode})}>
                {[{
                    _id: "1",
                    group_name: "Con Nghien",
                    users: [
                        {
                            _id: "1",
                            avatar: "https://i.ytimg.com/vi/IuB2LQtscfs/maxresdefault.jpg"
                        } , {
                            _id: "2",
                            avatar: "https://znews-photo.zadn.vn/w660/Uploaded/fsmqv/2015_02_12/luyen_3.jpg"
                        }
                    ],
                    active: true,
                    last_active: new Date()
                }, {
                    _id: "2",
                    users: [
                        {
                            _id: "1",
                            basic_info: {
                                username: "Tuan Hoang"
                            }
                        } , {
                            _id: "2",
                            avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Red_Ribbon.svg/220px-Red_Ribbon.svg.png",
                            basic_info: {
                                username: "Suc Cac"
                            }
                        },  {
                            _id: "3",
                            avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Red_Ribbon.svg/220px-Red_Ribbon.svg.png",
                            basic_info: {
                                username: "Vinataba"
                            }
                        }
                    ],
                    active: false,
                    last_active: new Date()
                }, {
                    _id: "3",
                    group_name: "Tét griyp",
                    users: [
                        {
                            _id: "1",
                            avatar: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Sida-aids.png"
                        } , {
                            basic_info: {
                                username: "Xuan Thang"
                            },
                            _id: "2",
                        }
                    ],

                    active: true,
                    last_active: new Date()
                }].map(each => (
                    <div className="each-group" key={each._id}>
                        <div className="user-avatar">
                            <GroupChatAvatar
                                active={each.active}
                                users={each.users}
                            />
                        </div>
                        <p className="username">{generateGroupChatName(each)}</p>
                        <span className="last-active">{formatMomentTimeRange(moment(each.last_active).fromNow())}</span>
                    </div>
                ))}
            </div>
        );
    }
}
