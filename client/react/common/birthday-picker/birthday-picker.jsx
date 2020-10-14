import React, {Component} from 'react';
import {generateArrayFromRange} from "../../../common/utils/array-utils";
import {Select} from "../select/select";
import {getDaysInMonth} from "../../../common/utils/date-utils";

const currentYear = new Date().getFullYear();

const years = generateArrayFromRange(currentYear - 80, currentYear - 10);

const months =  generateArrayFromRange(1, 12);

export class BirthdayPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {...props.value} || {
            day: 12,
            month: 1,
            year: 1998
        }
    }
    render() {
        let {day, month, year} = this.state;
        let {label = "Ngày sinh", error = null, onChange} = this.props;
        let days = getDaysInMonth(month, year);
        return (
            <div className="birthday-picker">
                {label && (
                    <p className="birthday-picker-label">{label}</p>
                )}

                <div className="pickers">
                    <Select
                        className={"birthday-picker-picker day-picker"}
                        options={days}
                        value={day}
                        onChange={day => {
                            this.setState({day}, () => {
                                onChange(this.state);
                            });
                        }}
                        displayAs={value => "Ngày " + value}
                        isSelected={option => option === day}
                    />
                    <Select
                        className={"birthday-picker-picker month-picker"}
                        options={months}
                        value={month}
                        onChange={month => {
                            this.setState({month}, () => {
                                onChange(this.state);
                            });
                        }}
                        displayAs={value => "Tháng " + value}
                        isSelected={option => option === month}
                    />
                    <Select
                        className={"birthday-picker-picker year-picker"}
                        options={years}
                        value={year}
                        onChange={year => {
                            this.setState({year}, () => {
                                onChange(this.state);
                            });
                        }}
                        displayAs={value => "Năm " + value}
                        isSelected={option => option === year}
                    />
                </div>
                {(error) && (
                    <div className="invalid-feedback">{error.message}</div>
                )}
            </div>
        );
    }
}
