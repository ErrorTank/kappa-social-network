import React from "react";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {PageTitle} from "../../../common/page-title/page-title";
import {semester as semesters} from "../../../../const/semester";
import {years} from "../../../../const/years";
import {mergeYear} from "../../../../common/utils/common";
import {appConfigCache} from "../../../../common/cache/api-cache/common-cache";
import {schoolScheduleApi} from "../../../../api/common/school-schedule-api";
import {ApiScheduleBoard} from "../../../common/api-schedule-board/api-schedule-board";
import {Select} from "../../../common/select/select";
import {userInfo} from "../../../../common/states/common";
import {classStudentModal} from "../../../common/modal/class-student-modal/class-student-modal";

export default class InsScheduleRoute extends React.Component {
    constructor(props) {
        super(props);
        const {currentYear, currentSemester} = appConfigCache.syncGet();
        this.state = {
            semester: semesters.find(each => each.value === currentSemester),
            year: years.find(each => each.value === mergeYear(currentYear)),
            list: []
        };
    };

    displayInsScheduleItem = (item) => {
        return (
            <div className="common-inner-task">
                <div className="class-name">
                    {item.class.name}
                </div>
                <div className="class-room-name">
                    {item.classRoom.name}
                </div>
            </div>
        )
    };

    onClickScheduleItem = item => {
        classStudentModal.open({
            item,
            semester: this.state.semester,
            year: this.state.year
        })
    };

    render() {
        const api = (config) => schoolScheduleApi.getInstructorSchedule(config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
            };
        });
        let {
            semester,
            year
        } = this.state;
        let {identityID, name} = userInfo.getState();
        return (
            <PageTitle
                title={"Lịch giảng dạy"}
            >
                <AuthenLayoutTitle
                    title={"Tra cứu lịch giảng dạy"}
                >
                    <div className="ins-schedule-route manage-list-route">
                        <div className="common-route-wrapper">
                            <div className="schedule-items">
                                <div className="table-title">
                                    Lịch giảng dạy GV {name} ({identityID}) {semester.label} năm học {year.label}
                                </div>
                                <div className="table-actions">
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

                                                this.setState({semester: semesters.find(sp => sp.value === Number(e.target.value))})
                                            }}
                                        />

                                    </div>

                                </div>
                                <ApiScheduleBoard
                                    className={"ins-schedule-board"}
                                    api={api}
                                    filter={{
                                        semester,
                                        year
                                    }}
                                    displayItem={this.displayInsScheduleItem}
                                    emptyNotify={"Không có ngày giảng dạy nào"}
                                    onClickItem={this.onClickScheduleItem}
                                    getDayOfWeek={item => item.dayOfWeek}
                                    getShiftStart={item => item.from.name}
                                    getShiftEnd={item => item.to.name}
                                    showSuggestion
                                />
                            </div>

                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}