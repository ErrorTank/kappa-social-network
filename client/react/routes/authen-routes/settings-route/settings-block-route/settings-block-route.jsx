import React, {Component} from 'react';
import {PageTitle} from "../../../../common/page-title/page-title";
import {Avatar} from "../../../../common/avatar/avatar";
import {Button} from "../../../../common/button/button";
import {userApi} from "../../../../../api/common/user-api";
import {userInfo} from "../../../../../common/states/common";

class SettingsBlockRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blocks: []
        }
        userApi.getUserBlocks(userInfo.getState()._id)
            .then(blocks => this.setState({blocks}))
    }

    unblock = ({_id}) => {
        userApi.unblock(userInfo.getState()._id, _id)
            .then(() => this.setState({blocks: this.state.blocks.filter(each => each._id !== _id)}))
    }

    render() {
        let {blocks} = this.state;

        return (
            <PageTitle
                title={`Cài đặt chặn`}

            >
                <div className="settings-block-route settings-route white-box">
                    <div className="sr-title">
                        Cài đặt chặn
                    </div>
                    <div className="sbr-sub">
                        Những người thuộc danh sách chặn sẽ không thể:
                        <ul>
                            <li>- Xem bài viết của bạn</li>
                            <li>- Nhắn tin cho bạn</li>
                            <li>- Thêm bạn làm bạn bè</li>
                        </ul>
                    </div>
                    <div className="sr-body">
                        {blocks.map(each => (
                            <div className="each-block" key={each._id}>
                                <div className="block-info">
                                    <Avatar
                                        user={each}
                                    />
                                    <div className="block-username">{each.basic_info.username}</div>
                                </div>
                                <Button className="btn btn-grey" onClick={() => this.unblock(each)}>
                                    Bỏ chặn
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </PageTitle>
        );
    }
}

export default SettingsBlockRoute;