import React from "react";
import {InputFileExcel} from "../../../../../common/input-file-excel/input-file-excel";
import {KComponent} from "../../../../../common/k-component";
import {uploadCommonFile} from "../../../../../../common/utils/excel";
import * as yup from "yup";
import {createSimpleForm} from "../../../../../common/form-validator/form-validator";
import {CommonInput} from "../../../../../common/common-input/common-input";
import {Select} from "../../../../../common/select/select";
import {years} from "../../../../../../const/years";
import {semester as semesters, semester} from "../../../../../../const/semester";
import {studentGroups} from "../../../../../../const/student-group";
import classnames from "classnames"
import {LoadingInline} from "../../../../../common/loading-inline/loading-inline";
import {wait1, wait2} from "../../../../../../common/utils/common";


export class ScheduleForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false

        };
        this.props.form.validateData();

    };



    handleUpload = async (file) => {
        this.setState({loading: true});

        await wait1(async () => {
            let result = await uploadCommonFile(file);
            this.setState({loading: false});
            this.props.form.updateData(result);
        });


    };

    render() {
        let data = this.props.form.getData();

        return (
            <div className={classnames("schedule-form u-form", {valid: this.props.form.isValid()})}>
                <div className="upload-form-row">
                    <p className="upload-label">Chọn file</p>
                    <InputFileExcel
                        onUploaded={this.handleUpload}
                        render={({onClick}) => (
                            <button className="btn btn-upload"
                                    onClick={(file) => onClick(file)}
                                    disabled={this.state.loading}
                            >
                                Tải lên
                                {this.state.loading && (
                                    <LoadingInline
                                        className={"login-loading"}
                                    />
                                )}
                            </button>
                        )}
                    />
                    <span className="file-name">{data.fileName}</span>
                </div>
                {!!data.list.length && (
                    <>
                        <div className="upload-form-row">
                            <p className="upload-label">Năm học</p>
                            {this.props.form.enhanceComponent("year", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    error={error}
                                    options={years.filter(each => each.value !== "")}
                                    value={others.value}
                                    displayAs={(each) => each.label}
                                    getValue={each => each.value}
                                    onChange={e => {
                                        onChange(years.find(sp => sp.value === e.target.value))
                                    }}
                                />

                            ), true)}
                        </div>
                        <div className="upload-form-row">
                            <p className="upload-label">Học kì</p>
                            {this.props.form.enhanceComponent("semester", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    error={error}
                                    options={semester.filter(each => each.value !== "")}
                                    value={others.value}
                                    displayAs={(each) => each.label}
                                    getValue={each => each.value}
                                    onChange={e => {
                                        let value = e.target.value === "" ? "" : Number(e.target.value);
                                        onChange(semesters.find(sp => sp.value === value))
                                    }}
                                />

                            ), true)}
                        </div>
                        <div className="upload-form-row">
                            <p className="upload-label">Nhóm</p>
                            {this.props.form.enhanceComponent("studentGroup", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    error={error}
                                    options={studentGroups.filter(each => each.value !== "")}
                                    value={others.value}
                                    displayAs={(each) => each.label}
                                    getValue={each => each.value}
                                    onChange={e => {
                                        let value = e.target.value === "" ? "" : Number(e.target.value);
                                        onChange(studentGroups.find(sp => sp.value === value));
                                    }}
                                />

                            ), true)}
                        </div>
                    </>
                )

                }
            </div>
        );
    }
}