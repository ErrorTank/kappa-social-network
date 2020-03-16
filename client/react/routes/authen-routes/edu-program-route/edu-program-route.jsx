import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import moment from "moment"
import {KComponent} from "../../../common/k-component";
import {userInfo} from "../../../../common/states/common";
import classnames from "classnames"
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {Select} from "../../../common/select/select";
import {eduProgramApi} from "../../../../api/common/edu-program-api";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";

export default class EduProgramRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            eduProgram: null,
            list: [],
            eduPrograms: []
        };
        eduProgramApi.getAll().then(eduPrograms => this.setState({eduPrograms, loading: false, eduProgram: eduPrograms[0]}))
    };

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => i + 1,

        }, {
            label: "Mã môn",
            cellDisplay: (s) => s.subjectID,

        }, {
            label: "Tên môn",
            cellDisplay: (s) => s.name,

        }, {
            label: "Học phần tiên quyết",
            cellDisplay: (s) => (
                <div className="display-required-subs">
                    {!s.subjectsRequired.length ? (
                        ""
                    ) : (s.subjectsRequired.reduce((r, c) => r + `, ${c} (${this.state.list.findIndex(each => each.subjectID === c) + 1})` ,"")).substring(2)}
                </div>
            ),

        }, {
            label: "TC tiên quyết",
            cellDisplay: (s) => s.creditsRequired || "",

        }, {
            label: "TC",
            cellDisplay: (s) => s.credits,

        },
    ];

    render() {
        const api = (config) => eduProgramApi.getEduProgram(config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
                total: null,
            };
        });
        let {loading, eduProgram, eduPrograms} = this.state;
        return (

            <PageTitle
                title={"Chương trình đào tạo"}
            >
                <AuthenLayoutTitle
                    title={"Chương trình đào tạo"}
                >
                    <div className="educate-program-route">
                        <div className="common-route-wrapper">
                            <div className="edu-programs">
                                {!loading && (
                                    <>
                                        <div className="table-actions">
                                            <div className="spec-select">
                                                <span className="label">Chương trình đào tạo ngành</span>
                                                <Select
                                                    options={eduPrograms}
                                                    value={eduProgram}
                                                    displayAs={(each) => each.speciality.name}
                                                    getValue={each => each._id}
                                                    onChange={e => {
                                                        this.setState({eduProgram: eduPrograms.find(sp => sp._id === e.target.value)})
                                                    }}
                                                />

                                            </div>
                                        </div>
                                        <CommonDataTable
                                            className={"result-table"}
                                            api={api}
                                            filter={{
                                                eduProgram
                                            }}
                                            columns={this.columns}
                                            rowTrackBy={(row, i) => row._id}
                                            emptyNotify={"Không có môn học nào"}
                                        />
                                    </>
                                )}


                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}