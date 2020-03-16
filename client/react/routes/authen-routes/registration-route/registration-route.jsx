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
import {RegistrationDetails} from "./registration-details";
import {scheduleApi} from "../../../../api/common/schedule-api";
import {userInfo} from "../../../../common/states/common";
import {appConfigCache} from "../../../../common/cache/api-cache/common-cache";
import pick from "lodash/pick"
import isEqual from "lodash/isEqual"
import {appModal} from "../../../common/modal/modals";
import io from "socket.io-client";
import {SchoolCharge} from "../../../common/school-charge/school-charge";
import {getStudentGroup} from "../../../../common/utils/common";
import {SubjectRegisterableList} from "./subject-registerable-list/subject-registerable-list";

export default class RegistrationRoute extends React.Component {
    constructor(props) {
        super(props);
        this.init = {
            event: null,
            subjectList: [],
            error: null,
            loading: true,
            delayEvent: null,
            pickedSubject: null,

        };
        this.state = {...this.init,   schedule: null};
        this.socket = null;
        this.socket = io(document.location.origin + "/subject-registered");
        this.socket.on('connect', () => {
            this.socket.on("start-event", ({parentID, year, semester, studentGroup, event}) => {

                let {info} = userInfo.getState();
                let {currentYear, currentSemester, latestSchoolYear} = appConfigCache.syncGet();
                console.log(currentSemester === Number(semester))
                console.log(Number(year.from) === currentYear.from)
                console.log(Number(year.to) === currentYear.to)
                console.log(studentGroup === getStudentGroup(info.schoolYear, info.speciality.department, latestSchoolYear))
                console.log(event.appliedStudents.find(each => each.toString() === info._id.toString()))
                if (currentSemester === Number(semester) && Number(year.from) === currentYear.from && Number(year.to) === currentYear.to && studentGroup === getStudentGroup(info.schoolYear, info.speciality.department, latestSchoolYear) && event.appliedStudents.find(each => each.toString() === info._id.toString())) {
                    this.setState({loading: true});
                    this.loadData().then(data => {
                        if(!data.delayEvent){
                            this.socket.emit("join", data.event._id);
                            this.board.loadData();
                        }

                        this.setState({...this.init, ...data, loading: false});
                    }).catch((error) => {
                        this.setState({...this.init, error, loading: false});
                    });
                }
            });
            this.socket.on("stop-event", ({parentID, year, semester, studentGroup, event}) => {
                //TODO stop evnet
                console.log("zzz")
                let {info} = userInfo.getState();
                console.log(parentID)
                if (this.state.event && this.state.event._id === parentID  && event.appliedStudents.find(each => each.toString() === info._id.toString())) {
                    this.socket.emit("unsubscribe", parentID);
                    this.setState({loading: true});
                    setTimeout(() => {
                        this.loadData().then(data => {
                            this.setState({...this.init, ...data, loading: false});
                        }).catch((error) => {
                            this.setState({...this.init, error, loading: false} );
                        });
                    }, 2000)

                }
            });
            this.socket.on("update-subject-list", ({eventID, socketID, subject}) => {
                if (this.state.event && this.state.event._id === eventID && this.socket.id !== socketID) {
                    console.log(subject);
                    if (this.state.subjectList && this.state.subjectList.find(each => each._id === subject._id)) {
                        let {currentYear, currentSemester} = appConfigCache.syncGet();
                        registrationEventApi.getSubjectInfo(subject.lessons, `${currentYear.from}-${currentYear.to}`, currentSemester)
                            .then((lessons) => {
                                this.setState({loading: false});
                                this.updateSubjectLessons(subject, lessons);
                            }).catch((error) => {
                            this.setState({error, loading: false});
                        });

                    }

                }
            })

        });
        this.loadData().then(data => {
            if(!data.delayEvent){
                this.socket.emit("join", data.event._id);
            }

            this.setState({...data, loading: false});
        }).catch((error) => {
            this.setState({error, loading: false});
        });
    };

    loadData = () => {
        return registrationEventApi.getSubjectListForRegistration()
    };

    componentWillUnmount() {
        this.socket && this.socket.disconnect();
    }

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
        let {info} = userInfo.getState();
        let {currentYear, currentSemester} = appConfigCache.syncGet();
        let subject = this.state.subjectList.find(each => each.lessons.find(les => les.find(item => item._id === lesson[0]._id)));
        return scheduleApi.toggleRegisterLesson(info._id, `${currentYear.from}-${currentYear.to}`, currentSemester, ({
            socketID: this.socket.id,
            lesson,
            eventID: this.state.event._id,
            subject
        })).then(() => {

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

    onClickScheduleItem = (item, utils) => {
        let {setLoading} = utils;
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
    };


    render() {
        let {subjectList, error, loading, delayEvent, pickedSubject} = this.state;
        let subject = subjectList.find(each => each._id === pickedSubject);
        console.log(error)
        const api = async () => {
            let {info} = userInfo.getState();
            let {currentYear, currentSemester} = appConfigCache.syncGet();
            return scheduleApi.getStudentSchedule(info._id, `${currentYear.from}-${currentYear.to}`, currentSemester).then(schedule => {
                this.setState({schedule});
                return schedule || {list: []};
            })
        };
        let boardErr = (delayEvent || error) ? "Đăng ký học không khả dụng lúc này" : "";
        return (
            <PageTitle
                title={"Đăng ký học"}
            >
                <AuthenLayoutTitle
                    title={"Đăng ký học"}
                >
                    <div className="registration-route manage-list-route">
                        <div className="common-route-wrapper">
                            <div className="content-wrapper">
                                <div className="subject-list">
                                    {error ? (
                                        <Alert
                                            icon={(
                                                <i className="fas fa-info-circle"></i>
                                            )}
                                            strongText={"Thông báo:"}
                                            content={(
                                                <>

                                                    <span className="pl-3">{error.message}</span>
                                                </>
                                            )}
                                        />
                                    ) : loading ? (
                                        <LoadingInline/>
                                    ) : delayEvent ? (
                                        <div className="registration-notify">
                                            <div className="small-title"> Thông báo thời gian đăng ký học</div>

                                            <Alert
                                                icon={(
                                                    <i className="far fa-clock"></i>
                                                )}
                                                strongText={`Học kì ${delayEvent.semester + 1} Nhóm ${delayEvent.studentGroup} Năm học ${delayEvent.year.from}-${delayEvent.year.to}: `}
                                                color={"success"}
                                                content={(
                                                    <>

                                                        <span
                                                            className="pl-3">Từ <strong>{moment(delayEvent.activeChildEvent.from).format("HH:mm DD/MM/YYYY")}</strong> đến <strong>{moment(delayEvent.activeChildEvent.to).format("HH:mm DD/MM/YYYY")}</strong></span>
                                                    </>
                                                )}
                                            />
                                        </div>

                                    ) : (
                                        <>
                                            <div className="small-title">Danh sách môn đăng ký</div>
                                            <SubjectRegisterableList
                                                pickedSubject={pickedSubject}
                                                subjectList={subjectList}
                                                subject={subject}
                                                schedule={this.state.schedule}
                                                onRegister={this.onRegister}
                                                toggleRegister={this.toggleRegister}
                                                onChange={pickedSubject => this.setState({pickedSubject})}

                                            />

                                        </>
                                    )}

                                </div>
                                <SchoolCharge
                                    schoolYear={userInfo.getState().info.schoolYear}
                                    schedule={this.state.schedule}
                                    label={"Học phí tạm tính"}
                                />
                                <div className="small-title">Thời khóa biểu tạm thời</div>
                                <ApiScheduleBoard
                                    ref={board => this.board = board}
                                    className={"ins-schedule-board"}
                                    api={api}
                                    displayItem={this.displayInsScheduleItem}
                                    // emptyNotify={"Đăng ký học không khả dụng lúc này"}
                                    onClickItem={this.onClickScheduleItem}
                                    getDayOfWeek={item => item.dayOfWeek}
                                    getShiftStart={item => item.from.name}
                                    getShiftEnd={item => item.to.name}
                                    showSuggestion
                                    error={boardErr}
                                />


                            </div>

                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}