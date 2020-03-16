import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {SearchInput} from "../../../common/search-input/search-input";
import {schoolScheduleApi} from "../../../../api/common/school-schedule-api";
import {userInfo} from "../../../../common/states/common";
import {Checkbox} from "../../../common/checkbox/checkbox";
import {Tooltip} from "../../../common/tooltip/tooltip";
import classnames from "classnames";
import {schoolScheduleItemModal} from "../../../common/modal/school-schedule-item-modal/school-schedule-item-modal";
import {Select} from "../../../common/select/select";
import {years} from "../../../../const/years";
import {semester as semesters} from "../../../../const/semester";
import {appConfigCache} from "../../../../common/cache/api-cache/common-cache";
import {mergeYear} from "../../../../common/utils/common";

export default class DivisionClassRoute extends React.Component {
    constructor(props) {
        super(props);
        const {currentYear, currentSemester} = appConfigCache.syncGet();
        this.state = {
            keyword: "",
            semester: semesters.find(each => each.value === currentSemester),
            year: years.find(each => each.value === mergeYear(currentYear)),
            list: []
        };

    };

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => (
                <>

                    {i + 1}
                </>
            ),

        }, {
            label: "Mã môn",
            cellDisplay: (s) => s.class.subject.subjectID,

        }, {
            label: "Tên môn",
            cellDisplay: (s) => s.class.subject.name,

        }, {
            label: "Tên lớp",
            cellDisplay: (s) => s.class.name
            ,

        }, {
            label: "Thứ",
            cellDisplay: (s) => s.dayOfWeek + 1,

        }, {
            label: "Ca",
            cellDisplay: (s) => s.from.name + "-" + s.to.name

        }, {
            label: "Phòng học",
            cellDisplay: (s) => s.classRoom.name

        }, {
            label: "TC",
            cellDisplay: (s) => s.class.subject.credits

        }, {
            label: "Giáo viên",
            cellDisplay: (s) => s.instructor.user.name + `(${s.instructor.user.identityID})`

        }
    ];

    handleClickRow = (e, item) => {

        schoolScheduleItemModal.open({
            item
        })
    };

    render() {
        let {keyword, list, semester, year} = this.state;
        const api = (config) => schoolScheduleApi.getSchoolScheduleItemsByDivision(userInfo.getState().info.division._id, config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
                total: null,
            };
        });
        return (
            <PageTitle
                title={"Lớp bộ môn"}
            >
                <AuthenLayoutTitle
                    title={"Tra cứu lớp bộ môn"}
                >
                    <div className="division-class-route manage-list-route">
                        <div className="common-route-wrapper">
                            <div className="schedule-items">
                                <div className="table-actions">
                                    <div className="spec-select search-schedules">
                                        <SearchInput
                                            placeholder={`Tìm theo tên môn, mã môn hoặc mã GV`}
                                            onSearch={(keyword) => this.setState({keyword})}
                                            value={keyword}
                                        />

                                    </div>
                                    <div className="spec-select">
                                        <span className="label">Năm học</span>
                                        <Select
                                            options={years.filter(each => each.value !== "")}
                                            value={year}
                                            displayAs={(each) => each.label}
                                            getValue={each => each.value}
                                            onChange={e => {
                                                this.setState({year: years.find(sp => sp.value === e.target.value)})
                                            }}
                                        />

                                    </div>
                                    <div className="spec-select">
                                        <span className="label">Học kì</span>
                                        <Select
                                            options={semesters.filter(each => each.value !== "")}
                                            value={semester}
                                            displayAs={(each) => each.label}
                                            getValue={each => each.value}
                                            onChange={e => {
                                                let value = e.target.value === "" ? "" : Number(e.target.value);
                                                this.setState({semester: semesters.find(sp => sp.value === value)})
                                            }}
                                        />

                                    </div>
                                </div>
                                <div className="custom-summary">
                                    Tìm
                                    thấy <span>{this.state.list ? this.state.list.length : 0}</span> lớp
                                    học phần thuộc <span>{userInfo.getState().info.division.name}</span>
                                </div>
                                <div className="sub">* Bấm vào lớp học phần để tra cứu</div>
                                <CommonDataTable
                                    className={"result-table"}
                                    api={api}
                                    filter={{
                                        keyword,
                                        semester,
                                        year
                                    }}
                                    onClickRow={this.handleClickRow}
                                    columns={this.columns}
                                    rowTrackBy={(row, i) => row._id}
                                    emptyNotify={"Không có môn học nào"}
                                />
                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}