import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {CommonLayout} from "../../../layout/common-layout/common-layout";
import {userApi} from "../../../../api/common/user-api";

class UserProfileRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: ""
        }
        userApi.getUserBasicInfo(props.match.params.userID)
            .then(user => this.setState({user_name: user.basic_info.username}))
    }

    render() {
        let {user_name} = this.state;
        return (
            <PageTitle
                title={!user_name ? `Tải thông tin...` : user_name}
            >
                <div className="user-profile-route">
                    <CommonLayout
                        mainRender={() => (
                            <div>
                            </div>
                        )}
                    />
                </div>

            </PageTitle>

        );
    }
}

export default UserProfileRoute;