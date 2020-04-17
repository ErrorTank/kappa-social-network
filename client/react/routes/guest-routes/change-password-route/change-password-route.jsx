import React, {Component} from 'react';
import {KComponent} from "../../../common/k-component";
import {PageTitle} from "../../../common/page-title/page-title";
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import * as yup from "yup";
import {userApi} from "../../../../api/common/user-api";
import {parseQueryString} from "../../../../common/utils/string-utils";
import {customHistory} from "../../routes";
import {guestApi} from "../../../../api/common/guest-api";
import {Button} from "../../../common/button/button";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {ChangePasswordForm} from "../../../common/change-password-form/change-password-form";

export default class ChangePasswordRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            session: null,
            changing: false
        };
        this.form = createSimpleForm(yup.object().shape({
            currentPassword: yup.string().test({
                message: "Mật khẩu hiện tại không đúng",
                test: value => {
                    console.log(this.state)
                    return this.state.session ? value === this.state.session.user.private_info.password : false;
                }
            }),
            newPassword: yup.string().min(4, "Mật khẩu bắt buộc từ 4 ký tự trở lên").noSpecialChar("Mật khẩu không được có kí tự đặc biệt"),
            rePassword: yup.string().equalTo(yup.ref("newPassword"), "Mật khẩu nhập lại không trùng với mật khẩu mới").required("Mật khẩu nhập lại không trùng với mật khẩu mới")
        }), {
            initData: {
                currentPassword: "",
                newPassword: "",
                rePassword: ""
            }
        });

        this.onUnmount(this.form.on("change", (state) => {
            this.forceUpdate();

        }));

        this.form.validateData();


    }

    changePassword = () => {
        this.setState({creating: true});
        return userApi.changePassword(this.state.session._id, this.form.getPathData("newPassword").trim())
            .then(() => {
                customHistory.push("/");
            })
            .catch(() => {
                customHistory.push("/");
            })
    };

    getUserBrief = (sessionID) => {
        this.setState({loading: true});

        return userApi.getChangePasswordUserBrief(sessionID)
            .then(session => this.setState({loading: false, session}))
            .catch(() => customHistory.push("/"))
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        let queryStringParams = parseQueryString(this.props.location.search);
        let lastQueryStringParams = parseQueryString(prevProps.location.search);
        if(!this.props.location.search || !queryStringParams.sessionID){
            return customHistory.push("/");
        }
        if (queryStringParams.sessionID !== lastQueryStringParams.sessionID) {
            this.setState({loading: true});
            this.getUserBrief(queryStringParams.sessionID)
        }
    };

    componentDidMount() {
        let params = parseQueryString(this.props.location.search);
        if(!this.props.location.search || !params.sessionID){
            return customHistory.push("/");
        }
        this.getUserBrief(params.sessionID)
    }

    render() {
        let {session, loading, creating} = this.state;
        return (
            <PageTitle
                title={"Đổi lại mật khẩu"}
            >
                <div className="forgot-password-route">
                    <div className="form-wrapper">
                        <div className="form-header">
                            <p className="form-title">Đổi mật khẩu</p>
                            <p className="sub-title">Điền các thông tin dưới đây để hoàn tất việc đổi mật khẩu</p>
                        </div>
                        <div className="form-body">
                            {loading ? (
                                <LoadingInline/>
                            ) : (
                                <>
                                    <ChangePasswordForm
                                        form={this.form}
                                    />
                                </>
                            )}
                        </div>
                        <div className="form-footer">
                            <Button className="btn-common-primary next-btn btn-block" loading={creating}
                                    disabled={creating || this.form.getInvalidPaths().length} onClick={this.changePassword}>Hoàn tất</Button>
                        </div>
                    </div>
                </div>
            </PageTitle>
        );
    }
}
