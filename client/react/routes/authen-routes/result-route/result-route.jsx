import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import moment from "moment"
import {KComponent} from "../../../common/k-component";
import {userInfo} from "../../../../common/states/common";
import classnames from "classnames"
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {Select} from "../../../common/select/select";
import {specialitiesCache} from "../../../../common/cache/api-cache/common-cache";
import {resultApi} from "../../../../api/common/result-api";
import {specialityApi} from "../../../../api/common/speciality-api";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";

export default class ResultRoute extends KComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            speciality: null,
            specialities: []
        };
        specialityApi.getStudentSpecs().then(specialities => this.setState({specialities, loading: false, speciality: specialities.find(each => each._id === userInfo.getState().info.speciality._id)}))
    };

    columns = [
        {
            label: "STT",
            cellDisplay: (r, i) => i + 1,

        }, {
            label: "Mã học phần",
            cellDisplay: (r) => r.subject.subjectID,

        }, {
            label: "Tên học phần",
            cellDisplay: (r) => r.subject.name,

        }, {
            label: "Sô tín chỉ",
            cellDisplay: (r) => r.subject.credits,

        }, {
            label: "Điểm",
            cellDisplay: (r) => <p className={classnames("grade-display", {tach: r.grade < 5 && r.grade > -2, wait: r.grade === -2})}>{r.grade === -2 ? "?" : r.grade}</p>,

        },
    ];

    calculateTotalCredits = (list) => {

        if(!list){
            return 0;
        }
        return list.reduce((total, cur) => total + ((cur.grade < 5 || ["PG121", "PG100"].includes(cur.subject.subjectID)) ? 0 : cur.subject.credits), 0);

    };

    calculateMeanGrade = (list) => {
        if(!list){
            return 0;
        }
        let passList = list.filter(each => each.grade >= 5 && !["PG121", "PG100"].includes(each.subject.subjectID));

        return (list.reduce((total, cur) => total + ((cur.grade < 5 || ["PG121", "PG100"].includes(cur.subject.subjectID)) ? 0 : cur.grade),0) / passList.length).toFixed(2);
    };
    calculatePendingCredits = (list) => {
        if(!list){
            return 0;
        }

        return list.reduce((total, cur) => total + (cur.grade === -2 ? cur.subject.credits : 0),0);
    };

    render() {
        let {name, identityID, dob, info} = userInfo.getState();
        const api = (config) => resultApi.getStudentResult(config).then((data) => {
            this.setState({ list: data.results,});
            return {
                list: data.results,
                total: null
            };
        });
        let {loading, speciality, specialities, list} = this.state;

        return (

            <PageTitle
                title={"Bảng điểm cá nhân"}
            >
                <AuthenLayoutTitle
                    title={"Bảng điểm cá nhân"}
                >
                    <div className="result-route">
                        <div className="left-panel">
                            <div className="common-route-wrapper">
                                <div className="student-summary">
                                    <div className="summary-info">
                                        <span className="label">Tổng số tín chỉ tích lũy:</span>
                                        <span className="value">{this.calculateTotalCredits(list)}</span>
                                    </div>
                                    <div className="summary-info">
                                        <span className="label">Trung bình chung tích lũy:</span>
                                        <span className="value">{this.calculateMeanGrade(list)}</span>
                                    </div>
                                    <div className="summary-info">
                                        <span className="label">Tổng số tín chỉ đang đợi điểm:</span>
                                        <span className="value">{this.calculatePendingCredits(list)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right-panel">
                            <div className="common-route-wrapper">
                                <div className="student-info">
                                    Bảng điểm sinh
                                    viên: <span>{name}</span> - <span>{identityID}</span> - <span>{moment(dob).format("DD/MM/YYYY")}</span> - <span>{info.speciality.shortName}{info.schoolYear}{info.englishLevel}</span>
                                </div>
                                <div className="student-result">
                                    {!loading && (
                                        <>
                                            <div className="table-actions">
                                                <div className="spec-select">
                                                    <span className="label">Ngành học</span>
                                                    {specialities.length === 1 ? (
                                                        <span className="value">{speciality.name}</span>
                                                    ) : (
                                                        <Select
                                                            options={specialities}
                                                            value={speciality}
                                                            displayAs={(each) => each.name}
                                                            getValue={each => each._id}
                                                            onChange={e => {
                                                                this.setState({speciality: specialities.find(sp => sp._id === e.target.value)})
                                                            }}
                                                        />
                                                    )}

                                                </div>
                                            </div>
                                            <CommonDataTable
                                                className={"result-table"}
                                                api={api}
                                                filter={{
                                                    speciality
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

                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}