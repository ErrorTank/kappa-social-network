import React, {Component} from 'react';
import {StatusAvatar} from "../../../../../common/status-avatar/status-avatar";

export class ContactSection extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className="contact-section">
                {[
                    {_id: "1", last_active: new Date(), basic_info: {username: "Tuan Anh"}, avatar: "https://lucloi.vn/wp-content/uploads/2020/02/218_copy.jpg", active: true},
                    {_id: "2", last_active: new Date(), basic_info: {username: "Quang Cuong"}},
                    {_id: "3", last_active: new Date(), basic_info: {username: "Tuan Hoang"}, avatar: "https://images-na.ssl-images-amazon.com/images/I/61RbIsRjqeL._AC_UL1000_.jpg", active: true},
                    {_id: "4", last_active: new Date(), basic_info: {username: "Quoc Viet"}, avatar: "https://video-images.vice.com/test-uploads/articles/5e8e11711f3611009884b77f/lede/1586369199663-lede-pallbearer.png?crop=0.8747xw:0.9671xh;0.0054xw,0.0319xh"},
                    {_id: "5", last_active: new Date(), basic_info: {username: "Xuan Thang"}},
                    {_id: "6", last_active: new Date(), basic_info: {username: "Ngoc"}},
                    {_id: "8", last_active: new Date(), basic_info: {username: "Tuan Trung"}, active: true},
                    {_id: "7", last_active: new Date(), basic_info: {username: "Huan Hoa Hong"}},
                    {_id: "9", last_active: new Date(), basic_info: {username: "Bitchesssssssssssssssssssssssssssssss"}, active: true},
                ].map((each) => (
                    <div className="contact" key={each._id}>
                        <div className="user-avatar">
                            <StatusAvatar
                                active={each.active}
                                user={each}
                            />
                        </div>
                        <p className="username">{each.basic_info.username}</p>
                        <span className="last-active"></span>
                    </div>
                ))}
            </div>
        );
    }
}
