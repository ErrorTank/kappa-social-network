import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {CommonLayout} from "../../../layout/common-layout/common-layout";
import {userApi} from "../../../../api/common/user-api";
import {UprHeader} from "./upr-header/upr-header";
import {UprBody} from "./upr-body/upr-body";

class UserProfileRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
        this.fetchUser(props.match.params.userID);
    }

    fetchUser = userID => {
        userApi.getUserBasicInfo(userID)
            .then(user => this.setState({user}))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.match.params.userID !== this.props.match.params.userID && this.props.match.params.userID){
            this.fetchUser(this.props.match.params.userID);
        }
    }

    render() {
        let {user} = this.state;

        return (
            <PageTitle
                title={!user ? `Tải thông tin...` : user.basic_info.username}
            >
                <div className="user-profile-route">
                    <CommonLayout
                        extendMain={true}
                        haveLeftRender={false}
                        haveRightRender={false}
                        mainRender={() => user ? (
                            <div className="upr-wrapper">
                                <UprHeader
                                    user={user}
                                />
                                <UprBody

                                />
                            </div>
                        ) : null}
                    />
                </div>

            </PageTitle>

        );
    }
}

export default UserProfileRoute;