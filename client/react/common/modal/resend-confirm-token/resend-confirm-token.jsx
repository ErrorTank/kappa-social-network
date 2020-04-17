import React, {Component} from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {modals} from "../modals";
import classnames from "classnames";
import uniq from "lodash/uniq"
import {createSimpleForm} from "../../form-validator/form-validator";
import * as yup from "yup";
import {CommonInput} from "../../common-input/common-input";
import {commonPopup} from "../../common-popup/common-popup";
import {CommonModalLayout} from "../common-modal-layout";
import {guestApi} from "../../../../api/common/guest-api";
import {userApi} from "../../../../api/common/user-api";

export const resendConfirmTokenModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <ResendConfirmTokenModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
            disabledOverlayClose: config.disabledClose
        });
        return modal.result;
    }
};

class ResendConfirmTokenModal extends Component{

    constructor(props){
        super(props);
        this.state={
            loading: true,
            errorCode: null,
        };

        let api = props.type === "account" ? guestApi.resendAccountConfirmationToken : userApi.resendResetPasswordToken
        api({
            userID: props.session.user._id,
            registerType: props.session.register_type
        })
            .then((data) => {
                this.setState({loading: false});
                props.onRequestEnd(data);
            })
            .catch((err) =>{
                this.setState({loading: false, errorCode: err.message || true});
                props.onRequestEnd(false);
            })

    };



    render(){
        let {loading, errorCode} = this.state;
        console.log(errorCode)
        let {onClose, disabledClose, type = "account"} = this.props;
        let matcher = {
            "user_not_existed": type === "account" ? "Tài khoản này không tồn tại hoặc đã được xác thực." : "Tài khoản này không tồn tại",
        };
        let content = errorCode ? matcher[errorCode] ?
            <p className="failed status"><i className="fal fa-times-circle"></i><span>{matcher[errorCode]}</span></p> :
            <p className="failed status"><i className="fal fa-times-circle"></i><span>Gửi lại mã xác thực thất bại!</span></p> :
            <p className="success status"><i className="fal fa-check-circle"></i><span>Gửi lại mã xác thực thành công!</span></p>;
        return(
            <CommonModalLayout
                className="resend-confirm-token-modal"
                onClose={() => {
                    if(!loading){
                        onClose();
                    }
                }}
                title={loading ? "Đang gửi lại mã xác thực" : "Thông báo"}
                actions={[
                    {
                        className: "btn-cancel",
                        onClick: () => {
                            if(!loading){
                                onClose();
                            }
                        },
                        content: "Đóng"
                    }
                ]}
            >
                {this.state.loading ? (
                    <LoadingInline/>
                ) : content}
            </CommonModalLayout>

        );
    }
}