import React from "react";
import * as yup from "yup";
import {createSimpleForm} from "../../../../../common/form-validator/form-validator";
import {
    uploadCommonFile
} from "../../../../../../common/utils/excel";
import {InputFileExcel} from "../../../../../common/input-file-excel/input-file-excel";
import {Select} from "../../../../../common/select/select";
import {years} from "../../../../../../const/years";
import {semester} from "../../../../../../const/semester";
import {studentGroups} from "../../../../../../const/student-group";
import {KComponent} from "../../../../../common/k-component";
import {specialitiesCache} from "../../../../../../common/cache/api-cache/common-cache";
import classnames from "classnames";
import {LoadingInline} from "../../../../../common/loading-inline/loading-inline";
import {wait1} from "../../../../../../common/utils/common";

export class EduProgramForm extends KComponent{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            specialities: []
        };
        this.props.form.validateData();

        specialitiesCache.get().then(specialities => this.setState({specialities}))
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
                            <p className="upload-label">Chuyên ngành</p>
                            {this.props.form.enhanceComponent("speciality", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    error={error}
                                    options={this.state.specialities}
                                    value={others.value}
                                    displayAs={(each) => each.name}
                                    getValue={each => each._id}
                                    onChange={e => {

                                        onChange(this.state.specialities.find(sp => sp._id === e.target.value))
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