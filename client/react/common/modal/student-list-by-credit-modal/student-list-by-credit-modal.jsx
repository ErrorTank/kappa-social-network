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
import {appConfigCache} from "../../../../common/cache/api-cache/common-cache";

export const studentListByCreditModal = {
    open({creditFilter, label}) {
        const modal = modals.openModal({
            content: (
                <StudentListByCreditModal
                    creditFilter={creditFilter}
                    onClose={() => modal.close()}
                    label={label}
                />
            )
        });
        return modal.result;
    }
};

class StudentListByCreditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
        };
        this.title = document.title;
        document.title = `Danh sách sinh viên có số tín chỉ đăng ký ${props.label} kì này`
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
        let {disabled,} = this.state;
        let {onClose, label, creditFilter} = this.props;
        let {currentYear, latestSchoolYear, currentSemester} = appConfigCache.syncGet();
        return (
            <div className={"class-student-modal common-modal"}>
                <div className="modal-header">
                    <div className="modal-title">
                        Danh sách sinh viên có số tín chỉ đăng ký {label} kì này
                    </div>
                    <i className="fas fa-times close-modal"
                       onClick={() => onClose()}
                    />
                </div>
                <div className="modal-body">
                    <ClassStudentInfo
                        ref={sInfo => this.sInfo = sInfo}
                        api={() => studentApi.getStudentByCredits(creditFilter, currentSemester, currentYear).then((students) => {
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
