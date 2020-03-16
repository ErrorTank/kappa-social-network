import React, {Fragment} from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {modals} from "../modals";
import classnames from "classnames";
import uniq from "lodash/uniq"
import {CommonDataTable} from "../../common-data-table/common-data-table";
import {studentApi} from "../../../../api/common/student-api";
import ReactToPrint from 'react-to-print';
import {userInfo} from "../../../../common/states/common";
import {ClassStudentInfo} from "../class-student-modal/class-student-modal";
import {MultipleTabWidget} from "../../multiple-tab-widget/multiple-tab-widget";
import {Badge} from "../../badge/badge";

export const schoolScheduleItemModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <SchoolScheduleItemModal
                    {...config}
                    onClose={() => modal.close()}
                />
            )
        });
        return modal.result;
    }
};

class ItemDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        let {info} = this.props;
        return(
            <div className="item-detail-info">
                <div className="info">
                    <span className="label">Thời gian</span>
                    <span className="value">Kì {info.semester + 1} Năm học {info.year.from} - {info.year.to}</span>
                </div>
                <div className="info">
                    <span className="label">Mã môn</span>
                    <span className="value">{info.class.subject.subjectID}</span>
                </div>
                <div className="info">
                    <span className="label">Tên môn</span>
                    <span className="value">{info.class.subject.name}</span>
                </div>
                <div className="info">
                    <span className="label">Tên lớp</span>
                    <span className="value">{info.class.name}</span>
                </div>
                <div className="info">
                    <span className="label">Ngày học</span>
                    <span className="value">{info.dayOfWeek + 1}</span>
                </div>
                <div className="info">
                    <span className="label">Ca học</span>
                    <span className="value">{info.from.name + "-" + info.to.name}</span>
                </div>
                <div className="info">
                    <span className="label">Phòng học</span>
                    <span className="value">{info.classRoom.name}</span>
                </div>
                <div className="info">
                    <span className="label">Tín chỉ</span>
                    <span className="value">{info.class.subject.credits}</span>
                </div>
                <div className="info">
                    <span className="label">Giáo viên dạy</span>
                    <span className="value">{info.instructor.user.name + `(${info.instructor.user.identityID})`}</span>
                </div>
                <div className="info">
                    <span className="label">Trạng thái</span>
                    <span className="value"><Badge
                        className={"common-badge lesson-badge"}
                        content={info.disabled ? "Đã hủy" : "Bình thường"}
                        style={info.disabled ? "danger" : "success"}
                    /></span>
                </div>
            </div>
        );
    }
}


class SchoolScheduleItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };


    };

    tabs = [
        {
            label: "Thông tin lớp",
            render: () => {
                return <ItemDetailInfo
                    info={this.props.item}
                />
            }
        },{
            label: "Danh sách sinh viên",
            render: () =>{
                return <ClassStudentInfo
                    api={() => studentApi.getStudentsBySchoolScheduleItem(this.props.item).then((students) => {
                        return {
                            list: students,
                            total: null
                        };
                    })}
                />
            }
        },
    ];



    render() {

        let {onClose, item} = this.props;
        console.log(item)
        return (
            <div className={"ssi-modal common-modal"}>
                <div className="modal-header">
                    <div className="modal-title">
                        Lớp {item.class.name}
                    </div>
                    <i className="fas fa-times close-modal"
                       onClick={() => onClose()}
                    />
                </div>
                <div className="modal-body">
                    <MultipleTabWidget
                        tabs={this.tabs}
                    />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-cancel" onClick={() => onClose()}>
                        Đóng
                    </button>

                </div>
            </div>
        );
    }
}