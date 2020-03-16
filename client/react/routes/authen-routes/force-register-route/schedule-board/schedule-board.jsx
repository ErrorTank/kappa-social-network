import React, {Component} from 'react';
import {SchoolCharge} from "../../../../common/school-charge/school-charge";
import {userInfo} from "../../../../../common/states/common";
import {ApiScheduleBoard} from "../../../../common/api-schedule-board/api-schedule-board";
import {scheduleApi} from "../../../../../api/common/schedule-api";
import {appConfigCache} from "../../../../../common/cache/api-cache/common-cache";
import {semester as semesters} from "../../../../../const/semester";
import {years} from "../../../../../const/years";
import {mergeYear} from "../../../../../common/utils/common";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual"
import {Select} from "../../../../common/select/select";
import classnames from "classnames";
import {RegistrationDetails} from "../../registration-route/registration-details";
import {SubjectRegisterableList} from "../../registration-route/subject-registerable-list/subject-registerable-list";
import {registrationEventApi} from "../../../../../api/common/registration-event";
import {appModal} from "../../../../common/modal/modals";
import {Alert} from "../../../../common/alert/alert";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";

export class ScheduleBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,

            pickedStudent: props.pickedStudents[0],
            pickedStudents: props.pickedStudents,
            pickedSubject: null,
            schedule: null,
            list: [],
            subjectList: []
        };
        this.loadData().then(data => {
            this.setState({...data, loading: false});
        }).catch((error) => {
            this.setState({error, loading: false});
        });
    }

    updateSubjectLessons = (sub, lessons) => {
        let {subjectList} = this.state;

        for (let i = 0; i < subjectList.length; i++) {
            let subject = subjectList[i];
            if (subject._id === sub._id) {
                subjectList[i].lessons = lessons;
                return this.setState({subjectList});
            }


        }
    };


    toggleRegister = (lesson) => {
        let {currentYear, currentSemester} = appConfigCache.syncGet();
        let subject = this.state.subjectList.find(each => each.lessons.find(les => les.find(item => item._id === lesson[0]._id)));
        return scheduleApi.toggleRegisterLesson(this.state.pickedStudent.info._id, `${currentYear.from}-${currentYear.to}`, currentSemester, {lesson}).then(() => {

            return Promise.all([this.board.loadData(), registrationEventApi.getSubjectInfo(subject.lessons, `${currentYear.from}-${currentYear.to}`, currentSemester).then(lessons => {
                this.updateSubjectLessons(subject, lessons);
                this.setState({loading: false});
            }).catch((error) => {
                this.setState({error, loading: false});
            })]);
        }).catch(err => {
            if (err.message === "full") {
                return appModal.alert({
                    text: (
                        <Alert
                            strongText={"Thông báo:"}
                            type={"border"}
                            color={"danger"}
                            content={(
                                <>

                                    <span className="pl-3">Bạn không thể đăng ký <strong>{err.extra.name}</strong> do lớp đã đầy</span>
                                </>
                            )}
                        />
                    ),
                    title: "Lỗi đăng ký",
                    btnText: "Đồng ý"
                })
            }
        });
    };

    onRegister = (lesson) => {

        let {schedule, pickedSubject, subjectList} = this.state;
        if (!schedule) {
            return this.toggleRegister(lesson)
        }
        let subject = subjectList.find(each => each._id === pickedSubject);
        let pickedSchoolSchedule = subject.lessons.reduce((total, cur) => total.concat(cur.map(each => each._id)), []);
        let currentList = schedule.list.map(each => each._id);
        let match = null;
        if (currentList.find(each => !!pickedSchoolSchedule.includes(each)) || !schedule.list.find(each => !!lesson.find(item => {
            if (item.dayOfWeek === each.dayOfWeek && !(item.from.name > each.to.name || item.to.name < each.from.name)) {
                match = {
                    newItem: item,
                    existed: each
                };
                return true;
            }
            return false;
        }))) {
            return this.toggleRegister(lesson)
        }
        console.log(match)
        return appModal.alert({
            text: (
                <Alert
                    strongText={"Thông báo:"}
                    type={"border"}
                    color={"danger"}
                    content={(
                        <>

                            <span className="pl-3">Bạn không thể đăng ký <strong>{match.newItem.name}</strong> do trùng vào <strong>{match.existed.dayOfWeek < 7 ? "Thứ " + (match.existed.dayOfWeek + 1) : "Chủ nhật"}</strong> <strong>Ca {match.existed.from.name}-{match.existed.to.name}</strong> của <strong>{match.existed.class.name}</strong></span>
                        </>
                    )}
                />
            ),
            title: "Lỗi đăng ký",
            btnText: "Đồng ý"
        })

    };

    loadData = () => {
        return registrationEventApi.getSubjectListForForceRegistration(this.state.pickedStudent)
    };

    onClickScheduleItem = (item, utils) => {
        let {setLoading} = utils;

        let {info} = userInfo.getState();
        console.log(info.division)
        console.log( item)
        if(info.division ? item.class.subject.division === info.division._id : userInfo.getState().role === "pdt"){
            setLoading();
            for (let subject of this.state.subjectList) {
                let {lessons} = subject;
                let lesson = lessons.find(each => {
                    return !!each.find(child => child._id === item._id)
                });
                if (lesson) {
                    return this.toggleRegister(lesson)
                }
            }
        }

    };

    refreshScheduleBoard = debounce((data) => {
        this.setState({
            pickedStudent: data.pickedStudents[0],
            pickedStudents: data.pickedStudents
        }, () => {
            this.board.loadData();
        });
    }, 1500);


    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.pickedStudents, this.props.pickedStudents)) {
            this.refreshScheduleBoard(nextProps);

        }
    }

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
        let {pickedStudent, pickedStudents, pickedSubject, subjectList, loading} = this.state;
        let subject = subjectList.find(each => each._id === pickedSubject);
        const {currentYear, currentSemester} = appConfigCache.syncGet();
        console.log(pickedStudent)
        const api = async () => {
            let {currentYear, currentSemester} = appConfigCache.syncGet();
            let {year, semester} = {
                year: years.find(each => each.value === mergeYear(currentYear)),
                semester: semesters.find(each => each.value === currentSemester)
            };
            return scheduleApi.getStudentSchedule(pickedStudent.info._id, year.value, semester.value).then(schedule => {
                this.setState({schedule});
                return schedule || {list: []};
            })
        };
        return (
            <div className="force-schedule-board">
                <div className="student-select">
                    <span className="label">Sinh viên đang chọn</span>
                    <Select
                        options={pickedStudents}
                        value={pickedStudent}
                        displayAs={(each) => each.name + ` (${each.identityID})`}
                        getValue={each => each._id}
                        onChange={e => {
                            this.setState({pickedStudent: pickedStudents.find(each => each._id === e.target.value), loading: true,   pickedSubject: null}, () => {

                                this.board.loadData();
                                this.loadData().then(data =>  this.setState({...data, loading: false}))
                            });
                        }}
                    />
                </div>
                <div className="content-wrapper-hehe">
                    <div className="subject-list">
                        {loading ? (
                            <LoadingInline/>
                        ) : (
                            <>
                                <div className="small-title">Danh sách môn đăng ký</div>
                                <SubjectRegisterableList
                                    pickedSubject={pickedSubject}
                                    subjectList={subjectList}
                                    schedule={this.state.schedule}
                                    subject={subject}
                                    onRegister={this.onRegister}
                                    toggleRegister={this.toggleRegister}
                                    onChange={pickedSubject => this.setState({pickedSubject})}
                                />

                            </>
                        )}

                    </div>

                    <SchoolCharge
                        schoolYear={pickedStudent.info.schoolYear}
                        schedule={this.state.schedule}
                        label={"Học phí kì này"}
                    />
                    <ApiScheduleBoard
                        filter={{
                            semester: semesters.find(each => each.value === currentSemester),
                            year: years.find(each => each.value === mergeYear(currentYear))
                        }}
                        ref={board => this.board = board}
                        className={"ins-schedule-board"}
                        api={api}
                        displayItem={this.displayInsScheduleItem}
                        // emptyNotify={"Sinh viên chưa đăng ký lớp học phần nào"}
                        onClickItem={this.onClickScheduleItem}
                        getDayOfWeek={item => item.dayOfWeek}
                        getShiftStart={item => item.from.name}
                        getShiftEnd={item => item.to.name}
                        showSuggestion
                    />


                </div>
            </div>
        );
    }
}
