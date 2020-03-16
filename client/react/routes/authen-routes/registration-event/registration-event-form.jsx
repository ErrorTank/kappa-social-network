import React, {Component} from 'react';
import {Select} from "../../../common/select/select";
import {years} from "../../../../const/years";
import {semester} from "../../../../const/semester";
import {studentGroups} from "../../../../const/student-group";
import {DateTimePicker, MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {CommonInput} from "../../../common/common-input/common-input";
import {KComponent} from "../../../common/k-component";
import * as yup from "yup";
import uniqid from "uniqid";
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import classnames from "classnames"
import isEqual from "lodash/isEqual"
import {Badge} from "../../../common/badge/badge";

export class RegistrationEventForm extends KComponent {
    constructor(props) {
        super(props);

        const registrationEventSchema = yup.object().shape({
            studentGroup: yup.object(),
            semester: yup.object(),
            year: yup.object(),
            childEvents: yup.array().of(yup.object().shape({
                delay: yup.number().min(0, "Thời gian delay phải lớn hơn 0 mili giây").typeError('Không được để trống'),
                from: yup.date().notReach("Thời gian bắt đầu phải trước kết thúc"),
                to: yup.date(),
                id: yup.string().notRequired(),
                _id: yup.string().notRequired(),
                status: yup.object().notRequired()
            })),

        });

        this.getInitChildEvent = (lastElem) => {
            let fromDate = lastElem ? new Date(lastElem.to) : new Date();
            fromDate.setDate(fromDate.getDate() + (lastElem ? 1 : 0));
            let toDate = new Date(fromDate);
            fromDate.setSeconds(0);
            fromDate.setMilliseconds(0);
            toDate.setSeconds(0);
            toDate.setMilliseconds(0);

            toDate.setDate(fromDate.getDate() + 1);

            return {
                id: uniqid(),
                delay: 0,
                from: fromDate.toISOString(),
                to: toDate.toISOString()
            }
        };

        const getInitData = () => {


            return {
                year: years[1],
                semester: semester[1],
                studentGroup: studentGroups[1],
                childEvents: [
                    {...this.getInitChildEvent()}
                ]

            }
        };

        this.form = createSimpleForm(registrationEventSchema, {
            initData: getInitData()
        });

        props.onFormChange(getInitData());
        this.onUnmount(this.form.on("change", (state) => {
            this.forceUpdate();
            this.props.onFormChange(state);

        }));


        this.watchProps("initData", (nextProps, currentProps) => {
            if (nextProps && !isEqual(currentProps, nextProps)) {
                this.form.updateData({
                    ...nextProps,
                    childEvents: JSON.parse(JSON.stringify([...nextProps.childEvents])),

                });
                this.form.validateData();
            }
        })
    }

    renderServerError = () => {
        let {serverError} = this.props;
        let {year, semester, studentGroup} = this.form.getData();
        let errMatcher = {
            "existed": `Đợt đăng ký học ${semester.label} ${studentGroup.label} năm học ${year.label} đã tồn tại`,
        };
        return errMatcher.hasOwnProperty(serverError) ? errMatcher[serverError] : "Đã có lỗi xảy ra"
    };


    removeEvent = (eventID) => {
        let events = this.form.getPathData("childEvents");
        this.form.updatePathData("childEvents", events.filter(each => each.id !== eventID));
    };

    addMoreEvent = () => {
        let events = this.form.getPathData("childEvents");
        let lastElem = {...events[events.length - 1]};
        this.form.updatePathData("childEvents", events.concat({...this.getInitChildEvent(lastElem)}));

    };

    getChildEventsError = (childEvents) => {
        if (childEvents.length === 1) {
            return false;
        }
        for (let i = 0; i < childEvents.length - 1; i++) {
            for (let j = i + 1; j < childEvents.length; j++) {
                let firstStart = new Date(childEvents[i].from).getTime();
                let firstEnd = new Date(childEvents[i].to).getTime();
                let lastStart = new Date(childEvents[j].from).getTime();
                let lastEnd = new Date(childEvents[j].to).getTime();
                // console.log(lastStart - firstEnd)
                // console.log(firstStart - lastEnd)
                if (!(lastStart - firstEnd > 0 || firstStart - lastEnd > 0)) {
                    return [childEvents[i].id, childEvents[j].id];
                }
            }

        }
        return false;
    };

    getBadgeStyle = type => {
        let matcher = [
            {
                style: "success",
            },
            {
                style: "danger"
            },
            {
                style: "warning"
            }
        ];
        return matcher[type].style;
    };

    render() {
        let childEvents = [...this.form.getPathData("childEvents")];
        let childEventsError = this.getChildEventsError(childEvents);
        console.log(this.form.getErrorPath("childEvents[0].from"))
        return (
            <>
                <div style={{padding: "20px 20px 0 20px"}}>
                    {this.props.serverError && (
                        <div className="server-error">
                            {this.renderServerError()}
                        </div>
                    )}
                </div>
                <div className="registration-event-form manage-form">
                    <div className="form-row row">
                        <div className="form-item col-4">
                            <p className="form-label">Năm học</p>
                            {this.form.enhanceComponent("year", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    disabled={this.props.disabledSelect}
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
                        <div className="form-item col-4">
                            <p className="form-label">Học kì</p>
                            {this.form.enhanceComponent("semester", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    disabled={this.props.disabledSelect}
                                    error={error}
                                    options={semester.filter(each => each.value !== "")}
                                    value={others.value}
                                    displayAs={(each) => each.label}
                                    getValue={each => each.value}
                                    onChange={e => {
                                        onChange(semester.find(sp => sp.value === Number(e.target.value)))
                                    }}
                                />

                            ), true)}

                        </div>
                        <div className="form-item col-4">
                            <p className="form-label">Nhóm</p>
                            {this.form.enhanceComponent("studentGroup", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    disabled={this.props.disabledSelect}
                                    error={error}
                                    options={studentGroups.filter(each => each.value !== "")}
                                    value={others.value}
                                    displayAs={(each) => each.label}
                                    getValue={each => each.value}
                                    onChange={e => {
                                        onChange(studentGroups.find(sp => sp.value === Number(e.target.value)))
                                    }}
                                />

                            ), true)}
                        </div>
                    </div>
                    <div className="child-summary">
                        <span className="label">Tổng số đợt nhỏ:</span>
                        <span className="value">{childEvents.length}</span>
                        {childEventsError && (
                            <span className="error">Khoảng thời gian giữa các đợt nhỏ không được trùng nhau</span>
                        )}

                        <p className="sub">*Số đợt nhỏ tối đa là 3</p>
                    </div>
                    {childEvents.map((each, i) => {
                        return (
                            <div
                                className={classnames("child-event", {error: childEventsError && childEventsError.includes(each.id)})}
                                key={each.id}>
                                {(this.props.isEdit && each.status) && (
                                    <>
                                        <div className="child-status">
                                            <span className="label">
                                                Trạng thái:
                                            </span>
                                                <span className="value">
                                                    <Badge
                                                        className={"common-badge"}
                                                        content={each.status.message}
                                                        style={this.getBadgeStyle(each.status.value)}
                                                    />
                                            </span>
                                        </div>
                                        <div className="child-status">
                                            <span className="label">
                                                SV tham gia:
                                            </span>
                                            <span className="value">

                                                    <Badge
                                                        className={"common-badge"}
                                                        content={each.appliedStudents.length + " sinh viên"}
                                                        style={"info"}
                                                    />
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="child-action">
                                    {(i === childEvents.length - 1 && childEvents.length < 3) && (
                                        <div className="action-btn plus"
                                             onClick={this.addMoreEvent}
                                        >
                                            <i className="fal fa-plus"></i>
                                        </div>
                                    )

                                    }

                                    {childEvents.length > 1 && (
                                        <div className="action-btn minus"
                                             onClick={() => this.removeEvent(each.id)}
                                        >
                                            <i className="fal fa-minus"></i>
                                        </div>
                                    )}

                                </div>
                                <div className="form-row row">
                                    <div className="form-item col-4">
                                        <p className="form-label">Thời gian bắt đầu</p>
                                        {this.form.enhanceComponent(`childEvents[${i}].from`, ({error, onChange, onEnter, ...others}) => {
                                            console.log(error)
                                            return (
                                                <div className="date-picker-wrapper">
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <DateTimePicker
                                                            showTodayButton
                                                            value={others.value}
                                                            onChange={(value) => {
                                                                let newDate = new Date(value);
                                                                value.setSeconds(0);
                                                                value.setMilliseconds(0);
                                                                onChange(newDate.toISOString())
                                                            }}
                                                            format="dd/MM/yyyy HH:mm"
                                                            autoOk
                                                            ampm={false}

                                                        />

                                                    </MuiPickersUtilsProvider>
                                                    {error && (
                                                        <p className="form-error">{error.message}</p>
                                                    )}
                                                </div>
                                            )
                                        }, true)}
                                    </div>
                                    <div className="form-item col-4">
                                        <p className="form-label">Thời gian kết thúc</p>
                                        {this.form.enhanceComponent(`childEvents[${i}].to`, ({error, onChange, onEnter, ...others}) => {

                                            return (
                                                <div className="date-picker-wrapper">
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <DateTimePicker
                                                            showTodayButton
                                                            value={others.value}
                                                            onChange={(value) => {
                                                                let newDate = new Date(value);
                                                                value.setSeconds(0);
                                                                value.setMilliseconds(0);
                                                                onChange(newDate.toISOString())
                                                            }}
                                                            format="dd/MM/yyyy HH:mm"
                                                            autoOk
                                                            ampm={false}
                                                        />

                                                    </MuiPickersUtilsProvider>
                                                    {error && (
                                                        <p className="form-error">{error.message}</p>
                                                    )}
                                                </div>
                                            )
                                        }, true, [`childEvents[${i}].from`])}
                                    </div>
                                    <div className="form-item col-4">
                                        {this.form.enhanceComponent(`childEvents[${i}].delay`, ({error, onChange, onEnter, ...others}) => (
                                            <CommonInput
                                                className="pt-0"
                                                id={`delay-${each.id}`}
                                                type={"number"}
                                                error={error}
                                                label={"Thời gian delay (Mili giây)"}

                                                placeholder={"Nhập thời gian delay"}
                                                onChange={e => {

                                                    onChange(e.target.value ? Number(e.target.value) : 0);

                                                }}
                                                {...others}
                                            />
                                        ), true)}
                                    </div>
                                </div>
                            </div>

                        )
                    })}
                    <div className="form-actions">
                        {this.props.renderActions(this.form, childEventsError)}
                    </div>
                </div>
            </>
        );
    }
}

