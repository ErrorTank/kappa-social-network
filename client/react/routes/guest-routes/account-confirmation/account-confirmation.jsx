import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {ConfirmAccountWidget} from "./confirm-account-widget/confirm-account-widget";
import {parseQueryString} from "../../../../common/utils/string-utils";
import {customHistory} from "../../routes";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {guestApi} from "../../../../api/common/guest-api";
import {appModal} from "../../../common/modal/modals";
import {openConnectionModal} from "../../../common/connection-modal/connection-modal";
import {resendConfirmTokenModal} from "../../../common/modal/resend-confirm-token/resend-confirm-token";
import {initializeAuthenticateUser} from "../../../../common/app-services";
import {topFloatNotifications} from "../../../common/float-top-notification/float-top-notification";
import {loginSessionCache} from "../../../../common/cache/login-session-cache";
import omit from "lodash/omit"

class AccountConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            session: null,
        };
        let queryStringParams = parseQueryString(props.location.search);
        if(!props.location.search || !queryStringParams.sessionID){
            return customHistory.push("/");
        }
        guestApi.checkSessionID(queryStringParams.sessionID).then((session) => {
            this.setState({session, loading: false});
        }).catch(() => {
            customHistory.push("/");
        })

    };

    componentDidUpdate(prevProps) {
        let queryStringParams = parseQueryString(this.props.location.search);
        let lastQueryStringParams = parseQueryString(prevProps.location.search);
        if(!this.props.location.search || !queryStringParams.sessionID){
            return customHistory.push("/");
        }
        if (queryStringParams.sessionID !== lastQueryStringParams.sessionID) {
            this.setState({loading: true});
            guestApi.checkSessionID(queryStringParams.sessionID).then((session) => {
                this.setState({session, loading: false});
            }).catch(() => {
                customHistory.push("/");
            })
        }
    }

    handleResendConfirmToken = () => {
        resendConfirmTokenModal.open({
            onRequestEnd: ({_id: sessionID}) => {
                if(sessionID){
                    customHistory.push(`/xac-thuc-tai-khoan?sessionID=${sessionID}`);
                }
            },
            session: this.state.session,
            disabledClose: true
        })
    };

    handleConfirm = (token) => {
        let queryStringParams = parseQueryString(this.props.location.search);
        return guestApi.verifyUser({token, sessionID: queryStringParams.sessionID})
            .then(({user, token}) => {
                loginSessionCache.addNewSession({
                    _id: user._id,
                    login_at: new Date().getTime()
                });
                topFloatNotifications.actions.push({
                    content: (
                        <p className="common-noti-layout success">
                            <i className="fal fa-check"></i>
                            <span>Xác thực tài khoản thành công</span>
                        </p>
                    )
                });
                initializeAuthenticateUser({
                    userInfo: user,
                    authToken: token
                }).then(() => customHistory.push("/"));
            })
            .catch((err) => {
                console.log(err)
                if(err.message === "wrong_token"){
                    appModal.alert({
                        title: "Thông báo",
                        text: "Mã xác thực sai hoặc đã hết hạn.",
                        btnText: "Đóng",
                    });
                }else{
                    openConnectionModal();
                }
                return Promise.reject();
            })
    };

    render() {

        return (
            <PageTitle
                title={"Xác thực tài khoản"}
            >
                <div className="forgot-password-route">
                    <div className="confirm-widget-wrapper">
                        {this.state.loading ? (
                            <LoadingInline/>
                        ) : (
                            <>
                                <ConfirmAccountWidget
                                    onConfirm={this.handleConfirm}
                                    session={this.state.session}
                                />
                                <div className="resend-token">Chưa nhận được mã? <span className="high-light" onClick={this.handleResendConfirmToken}>Gửi lại</span></div>
                            </>
                        )}

                    </div>
                </div>
            </PageTitle>
        );
    }
}

export default AccountConfirmation;