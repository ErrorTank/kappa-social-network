import React, {Component} from 'react';
import {StatusAvatar} from "../../../../../common/status-avatar/status-avatar";
import {formatMomentTimeRange} from "../../../../../../common/utils/common";
import moment from "moment";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import classnames from "classnames";
import {chatApi} from "../../../../../../api/common/chat-api";
import {Contact} from "./contact";
import {messengerApi} from "../../../../../../api/common/messenger-api";

// [
//     {_id: "1", last_active: new Date("12/01/1998"), basic_info: {username: "Tuan Anh"}, avatar: "https://lucloi.vn/wp-content/uploads/2020/02/218_copy.jpg", active: true},
//     {_id: "2", last_active: new Date(), basic_info: {username: "Quang Cuong"}},
//     {_id: "3", last_active: new Date(), basic_info: {username: "Tuan Hoang"}, avatar: "https://images-na.ssl-images-amazon.com/images/I/61RbIsRjqeL._AC_UL1000_.jpg", active: true},
//     {_id: "4", last_active: new Date(), basic_info: {username: "Quoc Viet"}, avatar: "https://video-images.vice.com/test-uploads/articles/5e8e11711f3611009884b77f/lede/1586369199663-lede-pallbearer.png?crop=0.8747xw:0.9671xh;0.0054xw,0.0319xh"},
//     {_id: "5", last_active: new Date(), basic_info: {username: "Xuan Thang"}},
//     {_id: "6", last_active: new Date(), basic_info: {username: "Ngoc"}},
//     {_id: "8", last_active: new Date(), basic_info: {username: "Tuan Trung"}, active: true},
//     {_id: "7", last_active: new Date(), basic_info: {username: "Huan Hoa Hong"}},
//     {_id: "9", last_active: new Date(), basic_info: {username: "Bitchesssssssssssssssssssssssssssssss"}, active: true},
// ]
export class ContactSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: true
        };
        chatApi.getChatContacts().then((list) => this.setState({list, loading: false}));

    }
    render() {
        let {list, loading} = this.state;
        return (
            <div className={classnames("contact-section", {darkMode: this.props.darkMode})}>
                {loading ? (
                    <div className="loading-wrapper">
                        {[1,2,3,4,5].map((each) => (
                            <div className="contact" key={each}>
                                <div className="user-avatar">
                                    <SkeletonTheme color={this.props.darkMode ? "#242526" : "#e3e3e3"} highlightColor={this.props.darkMode ? "#333436" : "#ebebeb"}>
                                        <Skeleton count={1} height={40} width={40} duration={1} circle={true}/>
                                    </SkeletonTheme>
                                </div>
                                <div className="username">
                                    <SkeletonTheme color={this.props.darkMode ? "#242526" : "#e3e3e3"} highlightColor={this.props.darkMode ? "#333436" : "#ebebeb"}>
                                        <Skeleton count={1} height={22} width={200} duration={1}/>
                                    </SkeletonTheme>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : list.length ? (
                    list.map((each) => (
                       <Contact user={each} key={each._id}/>
                    ))
                ) : (
                    <div className="cws-empty-notify">
                        Không có liên lạc nào
                    </div>
                )}
            </div>
        );
    }
}
