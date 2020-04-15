import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {ConfirmAccountWidget} from "./confirm-account-widget/confirm-account-widget";
import {parseQueryString} from "../../../../common/utils/string-utils";
import {customHistory} from "../../routes";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {guestApi} from "../../../../api/common/guest-api";
import {appModal} from "../../../common/modal/modals";
import {openConnectionModal} from "../../../common/connection-modal/connection-modal";

class AccountConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            session: null
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

    handleConfirm = (token) => {
        let queryStringParams = parseQueryString(this.props.location.search);
        return guestApi.verifyUser({token, sessionID: queryStringParams.sessionID})
            .then(() => {

            })
            .catch((err) => {
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
                            <ConfirmAccountWidget
                                onConfirm={this.handleConfirm}
                            />
                        )}

                    </div>
                </div>
            </PageTitle>
        );
    }
}

export default AccountConfirmation;