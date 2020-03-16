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
import {MultipleSteps} from "../../../../common/multiple-steps/multiple-steps";

class AccountNewRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            curStep: 0
        };

        let accountForm = getAccountFormStructure("account");
        this.accountBasicForm = createSimpleForm(accountForm.schema, {
            initData: {...accountForm.getInitData()}
        });
        this.infoForm = null;

        this.onUnmount(this.accountBasicForm.on("change", (state) => {
            this.state.error && this.setState({error: ""});
            this.forceUpdate();
        }));
    }


    detailFormComponent = {
        "pdt":  () => (
            <AdminPdtForm
                form={this.infoForm}
            />
        ),"admin": () => (
            <AdminPdtForm
                form={this.infoForm}
            />
        ),"gv": () => (
            <InstructorForm
                form={this.infoForm}
            />
        ),"sv": () => (
            <StudentForm
                form={this.infoForm}
            />
        ),
    };

    tabs = [
        {
            subtitle: "Thông tin tài khoản",
            render: () => {
                return <AccountBasicForm
                    form={this.accountBasicForm}
                    onChangeRole={() => {
                       if(this.infoForm){
                           delete this.infoForm;
                           this.infoForm = null;
                       }
                    }}
                />
            },
            onNext: () => {
               if(!this.infoForm){
                   console.log(this.accountBasicForm.getData())
                   let infoForm = getAccountFormStructure(this.accountBasicForm.getPathData("role"));
                   console.log(infoForm)
                   if(infoForm){
                       this.infoForm = createSimpleForm(infoForm.schema, {
                           initData: {...infoForm.getInitData()}
                       });
                       this.onUnmount(this.infoForm.on("change", (state) => {
                           console.log("cac")
                           this.state.error && this.setState({error: ""});
                           this.forceUpdate();
                       }));
                       this.setState({curStep: 1});
                   }else{
                        this.handleCreateAccount(this.accountBasicForm.getData());
                   }
               }else{
                   this.setState({curStep: 1});
               }



            },
            onClickNav: () => {
                this.setState({curStep: 0})
            },
            canNext: () => !this.state.loading && !this.accountBasicForm.getInvalidPaths().length,
        },{
            subtitle: "Thông tin chi tiết",
            render: () => {

                return this.detailFormComponent[this.accountBasicForm.getPathData("role")]()
            },
            nextLoading: () => {
                return this.state.loading;
            },
            canNext: () => !this.state.loading &&  (this.infoForm ? !this.infoForm.getInvalidPaths().length : true),
            onNext: () => {
                let formData = null;
                if(this.accountBasicForm){
                    formData = {...this.accountBasicForm.getData()};
                }
                if(this.infoForm){
                    formData.info = {...this.infoForm.getData()}
                }
                this.handleCreateAccount(formData);
            },
            onPrevious: () => {
                this.setState({curStep: 0});
            },

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

    handleCreateAccount = (formData) => {
        console.log(formData)
        this.setState({loading: true});
        userApi.createNewUser(formData).then((newInfo) => {
            commonPopup.publish({
                "common-popup": (
                    <div className="common-success-notify">
                        Tạo mới thành công
                    </div>

                ),

            });
            customHistory.push(`/manage/account/${newInfo._id}/edit`);

        }).catch(err => {
            this.setState({loading: false});
            console.log("dasd")
            appModal.alert({
                title: "Tạo mới thất bại",
                text: this.getServerError(err),
                btnText: "Ok",
                style: "danger"
            })
        })
    };


    render() {
        let { error, loading, curStep} = this.state;
        // if(!fetching){
        //     console.log(this.accountBasicForm.getData())
        //     console.log(this.accountBasicForm.getInvalidPaths())
        //     if(this.infoForm){
        //         console.log(this.infoForm.getData())
        //         console.log(this.infoForm.getInvalidPaths())
        //     }
        //
        // }
        console.log(!this.state.loading)
        console.log(!this.accountBasicForm.getInvalidPaths().length)
        console.log(this.infoForm)
        console.log(curStep)
        return (
            <PageTitle
                title={"Tạo mới người dùng"}
            >
                <AuthenLayoutTitle
                    title={"Tạo mới người dùng"}
                >
                    <div className="account-new-route account-route">
                        <div className="common-route-wrapper">
                            <MultipleSteps
                                btnConfig={{
                                    nextText: "Tiếp theo",
                                    cancelText: "Hủy bỏ",
                                    finishText: "Tạo mới",
                                    previousText: "Trở về"
                                }}
                                curStepIndex={curStep}
                                steps={this.tabs}
                                onCancel={() => customHistory.push("/manage/accounts")}
                            />

                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}

export default AccountNewRoute;