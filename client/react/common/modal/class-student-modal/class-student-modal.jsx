import React, {Fragment} from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {modals} from "../modals";
import classnames from "classnames";
import uniq from "lodash/uniq"
import {CommonDataTable} from "../../common-data-table/common-data-table";
import {studentApi} from "../../../../api/common/student-api";
import ReactToPrint from 'react-to-print';
import {userInfo} from "../../../../common/states/common";

export const classStudentModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <ClassStudentModal
                    {...config}
                    onClose={() => modal.close()}
                />
            )
        });
        return modal.result;
    }
};

class ClassStudentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
        };
        this.title = document.title;
        document.title = `Danh sách sinh viên lớp ${props.item.class.name} ${props.semester.label} Năm học ${props.year.label}`
    };

    componentWillUnmount() {
        document.title = this.title;
    }

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => i + 1,

        }, {
            label: "Mã sinh viên",
            cellDisplay: (s) => s.user.identityID,

        }, {
            label: "Họ và tên",
            cellDisplay: (s) => s.user.name,

        }, {
            label: "Lớp",
            cellDisplay: (s) => `${s.speciality.shortName}${s.schoolYear}${s.englishLevel}`,

        },
    ];

    render() {
        let {disabled, list} = this.state;
        let {onClose, item} = this.props;

        return (
            <div className={"class-student-modal common-modal"}>
                <div className="modal-header">
                    <div className="modal-title">
                        Danh sách sinh viên lớp {item.class.name}
                    </div>
                    <i className="fas fa-times close-modal"
                       onClick={() => onClose()}
                    />
                </div>
                <div className="modal-body">
                    <div className="summary">
                        Lớp gồm<span> {list.length} </span>sinh viên
                    </div>
                    <ClassStudentInfo
                        ref={sInfo => this.sInfo = sInfo}
                        api={() => studentApi.getStudentsBySchoolScheduleItem(item).then((students) => {
                            this.setState({disabled: !!!students.length});
                            return {
                                list: students,
                                total: null
                            };
                        })}
                    />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-cancel" onClick={() => onClose()}>
                        Đóng
                    </button>
                    <ReactToPrint
                        removeAfterPrint={true}
                        trigger={() =>
                            <button type="button" className="btn btn-confirm"
                                    disabled={disabled}
                            >
                                <i className="fal fa-print"></i>
                                In danh sách
                            </button>
                        }
                        content={() => this.sInfo.table}
                    />

                </div>
            </div>
        );
    }
}
export class ClassStudentInfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            students: []
        };
    };

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => i + 1,

        }, {
            label: "Mã sinh viên",
            cellDisplay: (s) => s.user ? s.user.identityID : "Unknown",

        }, {
            label: "Họ và tên",
            cellDisplay: (s) => s.user ? s.user.name : "Unknown",

        }, {
            label: "Lớp",
            cellDisplay: (s) => `${s.speciality.shortName}${s.schoolYear}${s.englishLevel}`,

        },
    ];

    render(){
        let {students,} = this.state;
        let {api} = this.props;

        return(
            <div className="class-student-info">

                <div className="table-container">
                    <CommonDataTable
                        className={"class-student-table"}
                        api={config => api(config).then(data => {
                            this.setState({students: data.list});
                            return data;
                        })}
                        ref={table => this.table = table}
                        columns={this.columns}
                        rowTrackBy={(row, i) => row._id}
                        emptyNotify={"Không có sinh viên nào"}
                    />
                </div>
            </div>
        );
    }
}
