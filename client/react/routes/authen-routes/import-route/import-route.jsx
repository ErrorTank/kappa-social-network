import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {DataTypePicker} from "./import-steps/data-type-picker";
import {UploadExcel} from "./import-steps/upload-excel";
import {ReviewData} from "./import-steps/review-data";
import {MultipleSteps} from "../../../common/multiple-steps/multiple-steps";
import * as yup from "yup";
import {years} from "../../../../const/years";
import {semester} from "../../../../const/semester";
import {studentGroups} from "../../../../const/student-group";
import {specialitiesCache} from "../../../../common/cache/api-cache/common-cache";
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import {KComponent} from "../../../common/k-component";
import {schoolScheduleApi} from "../../../../api/common/school-schedule-api";
import {resultApi} from "../../../../api/common/result-api";
import isEqual from "lodash/isEqual"
import {commonPopup} from "../../../common/common-popup/common-popup";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";

export default class ImportRoute extends KComponent {
    constructor(props) {
        super(props);

        this.scheduleItems = {
            fileName: "",
            list: [],
            year: years[1],
            semester: semester[1],
            studentGroup: studentGroups[1],
        };
        this.educateProgram = {
            fileName: "",
            list: [],
            speciality: specialitiesCache.syncGet()[0],
        };
        this.results = {
            fileName: "",
            list: [],
            msv: "",
            speciality: specialitiesCache.syncGet()[0],
            name: ""
        };
        this.initData = {
            dataType: 0,
            currentStep: 0,
            step2Loading: false,
            overview: null,
            step3Loading: false,
            error: null
        };
        this.state = {
            ...this.initData
        };
        const eduProgramForm = yup.object().shape({
            fileName: yup.string(),
            list: yup.array().min(1, "Chương trình học không được để trống"),
            speciality: yup.object(),
        });
        const resultForm = yup.object().shape({
            fileName: yup.string(),
            list: yup.array().min(1, "Kết quả không được để trống"),
            speciality: yup.object(),
            msv: yup.string().required("Mã sinh viên không được để trống"),
            name: yup.string().required("Tên sinh viên không được để trống"),
        });
        this.resultForm = createSimpleForm(resultForm, {
            initData: {
                ...this.results
            }
        });
        this.eduProgramForm = createSimpleForm(eduProgramForm, {
            initData: {
                ...this.educateProgram
            }
        });
        const scheduleForm = yup.object().shape({
            fileName: yup.string(),
            list: yup.array().min(1, "Thời khóa biểu không được để trống"),
            studentGroup: yup.object(),
            semester: yup.object(),
            year: yup.object()
        });
        this.scheduleForm = createSimpleForm(scheduleForm, {
            initData: {
                ...this.scheduleItems
            }
        });
        this.onUnmount(this.resultForm.on("change", (data, info) => {
            if(!info || !info.validate)
                this.state.error && this.setState({error: ""});
            this.forceUpdate();
        }));
        this.onUnmount(this.eduProgramForm.on("change", (data, info) => {
            if(!info || !info.validate)
                this.state.error && this.setState({error: ""});
            this.forceUpdate();
        }));
        this.onUnmount(this.scheduleForm.on("change", (data,info) => {
            if(!info || !info.validate)
                this.state.error && this.setState({error: ""});
            this.forceUpdate();
        }));



    };

    handleImportData = () => {
        this.setState({step3Loading: true});
        let action = this.step3Actions[this.state.dataType];
        action().then(overview => {
            let {dataType} = this.state;
            if(!dataType){

                this.scheduleForm.resetData();
                this.eduProgramForm.resetData();
            }else{
                this.resultForm.resetData();
            }
            this.setState({...this.initData});
            commonPopup.publish({
                "common-popup": (
                    <div className="common-success-notify">
                        {dataType ? "Import TKB & chương trình học thành công!" : "Import bảng điểm thành công!"}
                    </div>

                )
            });
        }).catch(err => {
            this.setState({currentStep: 1, overview: null, step3Loading: false, error: err.message})
        });
    };

    uploadEduProgramAndSchedule = () => {
        return schoolScheduleApi.uploadScheduleAndEduProgram({
            schedule: this.scheduleForm.getData(),
            eduProgram: this.eduProgramForm.getData()
        })
    };

    uploadResult = () => {
        return resultApi.uploadResult({result: this.resultForm.getData()})
    };

    importEduProgramAndSchedule = () => {
        return schoolScheduleApi.importScheduleAndEduProgram(this.state.overview)
    };

    importResult = () => {
        return resultApi.importResult(this.state.overview)
    };

    step3Actions = [
        this.importEduProgramAndSchedule,
        this.importResult
    ];

    step2Actions = [
        this.uploadEduProgramAndSchedule,
        this.uploadResult
    ];

    handleNextStep2 = () => {
        console.log(this.scheduleForm.getData())
        console.log(this.eduProgramForm.getData())
        console.log(this.resultForm.getData())
        this.setState({step2Loading: true, error: null});
        let action = this.step2Actions[this.state.dataType];
        action().then(overview => {
            this.setState({currentStep: 2, overview, step2Loading: false})
        });

    };

    steps = [
        {
            title: "Chọn loại dữ liệu tải lên",
            subtitle: "Chọn loại dữ liệu",
            render: () => (
                <DataTypePicker
                    onChange={dataType => this.setState({dataType, currentStep: 1})}
                />
            ),
            onNext: () => this.setState({currentStep: 1}),
            onClickNav: () => {
                this.scheduleForm.resetData();
                this.eduProgramForm.resetData();
                this.resultForm.resetData();
                this.setState({...this.initData})
            },
            hideCancel: () => true,
            hideNext: () => true,
        },
        {
            title: "Tải lên tệp dữ liệu",
            subtitle: "Tải dữ liệu lên",
            render: () => (
                <UploadExcel
                    error={this.state.error}
                    type={this.state.dataType}
                    scheduleForm={this.scheduleForm}
                    eduProgramForm={this.eduProgramForm}
                    resultForm={this.resultForm}
                />
            ),
            canNext: () => (this.state.dataType === 0 ? this.scheduleForm.isValid() && this.eduProgramForm.isValid() : this.resultForm.isValid()) && !this.state.error,
            onNext: this.handleNextStep2,
            nextLoading: () => {
              return this.state.step2Loading;
            },
            onClickNav: () => this.setState({currentStep: 1}),
            hideCancel: () => true,
            onPrevious: () => {
                this.scheduleForm.resetData();
                this.resultForm.resetData();
                this.eduProgramForm.resetData();
                this.setState({...this.initData});
            },
        },{
            title: "Xác nhận thông tin dữ liệu tải lên",
            subtitle: "Xác nhận dữ liệu",
            nextLoading: () => {
                return this.state.step3Loading;
            },
            render: () => (
                <ReviewData
                    type={this.state.dataType}
                    overview={this.state.overview}
                />
            ),
            canNext: () => true,
            onNext: this.handleImportData,
            onPrevious: () => {
                this.setState({currentStep: 1});
            },
        },
    ];


    render() {
        let {currentStep, loadSpec} = this.state;
        return (
            <PageTitle
                title={"Import"}
            >
                <AuthenLayoutTitle
                    title={"Import dữ liệu"}
                >
                    <div className="import-route">
                        <div className="multiple-steps-wrapper">
                            <MultipleSteps
                                btnConfig={{
                                    nextText: "Tiếp theo",
                                    cancelText: "Hủy bỏ",
                                    finishText: "Import dữ liệu",
                                    previousText: "Trở về"
                                }}
                                curStepIndex={currentStep}
                                steps={this.steps}
                                onCancel={() => {
                                    this.setState({...this.initData})
                                }}
                            />

                        </div>

                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}