import React from "react";
import ReactDOM from "react-dom";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {Alert} from "../../../common/alert/alert";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {registrationEventApi} from "../../../../api/common/registration-event";
import moment from "moment";
import {ApiScheduleBoard} from "../../../common/api-schedule-board/api-schedule-board";
import classnames from "classnames"
import {scheduleApi} from "../../../../api/common/schedule-api";
import {userInfo} from "../../../../common/states/common";
import {appConfigCache} from "../../../../common/cache/api-cache/common-cache";
import {SchoolCharge} from "../../../common/school-charge/school-charge";
import {semester as semesters} from "../../../../const/semester";
import {years} from "../../../../const/years";
import {mergeYear} from "../../../../common/utils/common";
import {Select} from "../../../common/select/select";

export default class ScheduleRoute extends React.Component {
    constructor(props) {
        super(props);
        const {currentYear, currentSemester} = appConfigCache.syncGet();
        this.state = {
            semester: semesters.find(each => each.value === currentSemester),
            year: years.find(each => each.value === mergeYear(currentYear)),
            list: []
        };
    };

    onClickScheduleItem = item => {

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


    render() {
        let {year, semester} = this.state;
        const api = async () => {
            let {info} = userInfo.getState();
            let {year, semester} = this.state;
            return scheduleApi.getStudentSchedule(info._id, year.value, semester.value, true).then(schedule => {
                this.setState({schedule});
                return schedule || {list: []};
            })
        };
        return (
            <PageTitle
                title={"Thời khóa biểu cá nhân"}
            >
                <AuthenLayoutTitle
                    title={"Thời khóa biểu cá nhân"}
                >
                    <div className="schedule-route manage-list-route">
                        <div className="common-route-wrapper">
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
                            <div className="content-wrapper">

                                <SchoolCharge
                                    schoolYear={userInfo.getState().info.schoolYear}
                                    schedule={this.state.schedule}
                                    label={"Học phí kì này"}
                                />
                                <ApiScheduleBoard
                                    filter={{
                                        semester,
                                        year
                                    }}
                                    ref={board => this.board = board}
                                    className={"ins-schedule-board"}
                                    api={api}
                                    displayItem={this.displayInsScheduleItem}
                                    emptyNotify={"Sinh viên chưa đăng ký lớp học phần nào"}
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