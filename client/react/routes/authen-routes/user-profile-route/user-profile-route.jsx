import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {CommonLayout} from "../../../layout/common-layout/common-layout";
import {userInfo} from "../../../../common/states/common";
import {InfiniteScrollWrapper} from "../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";

class UserProfileRoute extends Component {
    render() {
        let user = userInfo.getState();
        return (
            <PageTitle
                title={user.basic_info.username}
            >
                <InfiniteScrollWrapper
                    useWindowRoot
                    onScrollBottom={() => {
                        this.debounceLoad();

                    }}
                >
                    {() => (
                        <div className="user-profile-route">
                            <CommonLayout
                                mainRender={() => (
                                    <div>
                                    </div>
                                )}
                            />
                        </div>
                    )}
                </InfiniteScrollWrapper>

            </PageTitle>

        );
    }
}

export default UserProfileRoute;