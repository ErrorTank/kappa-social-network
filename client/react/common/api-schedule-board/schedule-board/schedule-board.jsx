import React from "react";
import {shifts, daysOfWeek} from "../../../../const/schedule";
import classnames from "classnames";
import {ShiftOverview} from "../../shift-overview/shift-overview";


export class ScheduleBoard extends React.Component {
    constructor(props) {
        super(props);
        this.initState = {
            curDay: null,
            curShiftStart: null,
            curShiftEnd: null,
        };

        this.state = {
            ...this.initState
        };
    };

    getClassesInADay = (day) => {
        let {getDayOfWeek, list} = this.props;
        return list.filter(each => {
            return getDayOfWeek(each) === day;
        });

    };

    render() {
        let {displayItem, onClickItem, getShiftStart, getShiftEnd, list, showSuggestion} = this.props;
        let {curDay, curShiftStart, curShiftEnd} = this.state;
        return (
            <div className="schedule-board">
                <div className={classnames("board-wrapper")}>

                    <div className={classnames("first-column board-column", {active: curDay === daysOfWeek[0]})}>
                        <div className="column-header">
                            <div className={classnames("board-cell", {active: curShiftStart === shifts[0]})}>
                                <div className="left-cell-alias">
                                    <p>Ca</p>
                                </div>
                                <div className="top-cell-alias">
                                    <p>Ngày</p>
                                </div>
                            </div>
                        </div>
                        <div className="column-body">
                            {shifts.map(each => {
                                return (
                                    <div className={classnames("board-cell", {active: (curShiftStart - 1) === each || curShiftEnd === each})} key={each}>
                                        {each}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {daysOfWeek.map(day => {
                        return (
                            <div className={classnames("board-column", {active: curDay === day || curDay === day + 1 || curDay === daysOfWeek[daysOfWeek.length - 1]})} key={day}>
                                <div className="column-header">
                                    <div className={classnames("board-cell", {active: curShiftStart === shifts[0]})}>
                                        {day < 7 ? "Thứ " + (day + 1) : "Chủ nhật"}
                                    </div>
                                </div>
                                <div className="column-body">
                                    {list && this.getClassesInADay(day).map(each => (
                                        <div className="board-task"
                                             onMouseEnter={() => this.setState({curShiftStart: getShiftStart(each), curShiftEnd: getShiftEnd(each), curDay: day})}
                                             onMouseLeave={() => this.setState({...this.initState})}
                                             key={each._id}
                                             onClick={() => onClickItem(each)}
                                             style={{
                                                 top: ((getShiftStart(each) - 1) * 40) + "px",
                                                 height: ((getShiftEnd(each) - getShiftStart(each) + 1) * 40) + "px"
                                             }}
                                        >
                                            {displayItem(each)}
                                        </div>
                                    ))}
                                    {shifts.map(shift => {
                                        return (
                                            <div className={classnames("board-cell", {active: (curShiftStart - 1) === shift || curShiftEnd === shift})} key={shift}>

                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {showSuggestion && (
                    <ShiftOverview/>
                )}
            </div>
        );
    }
}