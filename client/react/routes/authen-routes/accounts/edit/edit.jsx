import React, {Component} from 'react';
import {PageTitle} from "../../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";

import {userApi} from "../../../../../api/common/user-api";
import {MultipleTabWidget} from "../../../../common/multiple-tab-widget/multiple-tab-widget";
import pick from "lodash/pick";
import omit from "lodash/omit";
import {AccountBasicForm} from "../account-basic-form/account-basic-form";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import {getAccountFormStructure} from "../schema";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {KComponent} from "../../../../common/k-component";
import {AdminPdtForm} from "../common-form/admin-pdt-form";
import {InstructorForm} from "../common-form/instructor-form";
import {StudentForm} from "../common-form/student-form";
import {customHistory} from "../../../routes";
import isEqual from "lodash/isEqual";
import {appModal} from "../../../../common/modal/modals";
import {commonPopup} from "../../../../common/common-popup/common-popup";

class AccountEditRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            draft: {},
            fetching: true,
            deleting: false
        };

        let accountForm = getAccountFormStructure("account");

        this.fetchingData().then(data => {
            let newDate = new Date(data.dob);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
            data.dob = newDate.toISOString();
            this.accountBasicForm = createSimpleForm(accountForm.schema, {
                initData: {...accountForm.getInitData() ,...omit(data, "info")}
            });
            this.infoForm = null;
            let infoForm = getAccountFormStructure(data.role);
            if(infoForm){
                this.infoForm = createSimpleForm(infoForm.schema, {
                    initData: {...infoForm.getInitData() ,...data.info}
                });
                this.onUnmount(this.infoForm.on("change", (state) => {
                    this.state.error && this.setState({error: ""});
                    this.forceUpdate();
                }));
            }
            this.onUnmount(this.accountBasicForm.on("change", (state) => {
                this.state.error && this.setState({error: ""});
                this.forceUpdate();
            }));

            this.setState({
                draft: {...data},
                fetching: false
            });
        });
    }

    fetchingData = () => {
        return userApi.getUserDetails(this.props.match.params.accountID).then(data => {
            return data;
        })
    };

    detailFormComponent = {
        "pdt":  () => (
            <AdminPdtForm
                form={this.infoForm}
                isEdit
            />
        ),"admin": () => (
            <AdminPdtForm
                form={this.infoForm}
                isEdit
            />
        ),"gv": () => (
            <InstructorForm
                form={this.infoForm}
                isEdit
            />
        ),"sv": () => (
            <StudentForm
                form={this.infoForm}
                isEdit
            />
        ),
    };

    tabs = [
        {
            label: "Thông tin tài khoản",
            render: () => {
                return <AccountBasicForm
                    form={this.accountBasicForm}
                    isEdit
                />
            }
        },{
            label: "Thông tin chi tiết",
            render: () => {

                return this.detailFormComponent[this.state.draft.role]()
            },
            isDisabled: () => !this.infoForm
        },
    ];

    getServerError = (error) => {
        let errMatcher = {
            "duplicate_identityID": () => `Mã định danh ${error.extra.value} đã tồn tại`,
            "duplicate_email": () => `Email ${error.extra.value} đã tồn tại`,
            "duplicate_phone": () => `Số điện thoại ${error.extra.value} đã tồn tại`,
            "duplicate_username": () => `Tên đăng nhập ${error.extra.value} đã tồn tại`,
        };
        return errMatcher.hasOwnProperty(error.message) ? errMatcher[error.message]() : "Đã có lỗi xảy ra."
    };

    handleUpdateAccount = (formData) => {
        console.log(formData)
        this.setState({loading: true});
        userApi.updateUserInfo(formData._id, omit(formData, "_id")).then((newInfo) => {
            this.setState({loading: false, draft: {...newInfo}});
            this.accountBasicForm.updateData(omit(newInfo, "info"));
            if(this.infoForm){
                this.infoForm.updateData({...newInfo.info});
            }
            commonPopup.publish({
                "common-popup": (
                    <div className="common-success-notify">
                        Cập nhật thành công
                    </div>

                ),

            });

        }).catch(err => {
            this.setState({loading: false});
            console.log("dasd")
            appModal.alert({
                title: "Cập nhật thất bại",
                text: this.getServerError(err),
                btnText: "Ok",
                style: "danger"
            })
        })
    };

    deleteAccount = accountID => {
        return appModal.confirm({
            title: "Xác nhận",
            text: "Bạn muôn xóa tài khoản này?",
            btnText: "Đồng ý",
            cancelText: "Hủy bỏ"
        }).then(result => {
            if(result){
                this.setState({deleting: true});
                userApi.deleteAccount(accountID).then((data) => {
                    customHistory.push(`/manage/accounts`);
                    commonPopup.publish({
                        "common-popup": (
                            <div className="common-success-notify">
                                Xóa tài khoản {data.username} thành công
                            </div>

                        ),

                    });
                })

            }
        })
    };

    render() {
        let {fetching, draft, error, loading, deleting} = this.state;
        // if(!fetching){
        //     console.log(this.accountBasicForm.getData())
        //     console.log(this.accountBasicForm.getInvalidPaths())
        //     if(this.infoForm){
        //         console.log(this.infoForm.getData())
        //         console.log(this.infoForm.getInvalidPaths())
        //     }
        //
        // }


        let formData = null;
        if(this.accountBasicForm){
            formData = {...this.accountBasicForm.getData()};
        }
        if(this.infoForm){
            formData.info = {...this.infoForm.getData()}
        }
        console.log(formData)
        // console.log(formData)
        // console.log(this.infoForm ? draft : omit(draft, ["info"]))
        // console.log(isEqual(this.infoForm ? draft : omit(draft, ["info"]), formData))
        const canUpdate = !fetching && !deleting && !loading && (!this.accountBasicForm.getInvalidPaths().length && !error && !loading && !isEqual(this.infoForm ? draft : omit(draft, ["info"]), formData) && (this.infoForm ? !this.infoForm.getInvalidPaths().length : true)) ;
        return (
            <PageTitle
                title={"Cập nhật người dùng"}
            >
                <AuthenLayoutTitle
                    title={"Cập nhật người dùng"}
                >
                    <div className="account-edit-route account-route">
                        <div className="common-route-wrapper">

                            {fetching ? (
                                <LoadingInline/>
                            ) : (
                                <MultipleTabWidget
                                    tabs={this.tabs}
                                    initIndex={0}
                                />
                            )}


                            <div className="account-route-action">

                                <button className="btn btn-cancel"
                                        onClick={() => customHistory.push("/manage/accounts")}
                                >
                                    Hủy bỏ
                                </button>
                                <button className="btn btn-danger"
                                        onClick={() => this.deleteAccount(formData._id)}
                                        disabled={deleting}
                                >
                                    Xóa
                                    {deleting && (
                                        <LoadingInline/>
                                    )}
                                </button>
                                <button className="btn btn-next"
                                        onClick={() => this.handleUpdateAccount(formData)}
                                        disabled={!canUpdate}
                                >
                                    Cập nhật
                                    {loading && (
                                        <LoadingInline/>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}

export default AccountEditRoute;