import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {KComponent} from "../../../common/k-component";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {commonApi} from "../../../../api/common/common-api";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {MultipleSelect} from "../../../common/multiple-select/multiple-select";
import {ScheduleBoard} from "./schedule-board/schedule-board";

export default class ForceRegisterRoute extends KComponent {
    constructor(props) {
        super(props);


        this.initData = {
            pickedStudents: [],
            students: [],
            loadStudents: true,
        };

        this.state = {...this.initData};
        commonApi.getBriefStudents().then(students => this.setState({students: students.filter(each => each.identityID), loadStudents: false}));

    };


    filterStudents = (list, keyword) => {
        return list.filter(each => each.identityID.toLowerCase().includes(keyword.trim().toLowerCase()) || each.name.toLowerCase().includes(keyword.trim().toLowerCase()));
    };


    handleChangeStudents = pickedStudents => {
        this.setState({pickedStudents});
    };

    render() {
        let {students, loadStudents, pickedStudents,} = this.state;
        return (
            <PageTitle
                title={"Ép cứng"}
            >
                <AuthenLayoutTitle
                    title={"Ép cứng môn học"}
                >
                    <div className="force-register-route">
                        <div className="common-route-wrapper">
                            {loadStudents && (
                                <LoadingInline/>
                            )}
                            <div className="force-step">
                                <div className="step-title">
                                    <span className="strong">Bước 1:</span>Chọn sinh viên ép cứng
                                </div>
                                <div className="step-body">
                                    <div className="select-wrapper">
                                        <MultipleSelect
                                            values={pickedStudents}
                                            list={students}
                                            displayTagAs={(tag, index) => tag.identityID}
                                            displayAs={(item, index) => item.name + ` (${item.identityID})`}
                                            filterFunc={this.filterStudents}
                                            onChange={this.handleChangeStudents}
                                            listKey={(item) => item._id}
                                            tagKey={item => item._id}
                                            emptyNotify={() => "Không tìm thấy sinh viên nào"}
                                            isPicked={item => pickedStudents.find(each => each._id === item._id)}
                                            deleteFilterFunc={(item1, item2) => item1._id !== item2._id}
                                        />
                                    </div>
                                </div>
                            </div>
                            {!!pickedStudents.length && (
                                <div className="force-step">
                                    <div className="step-title">
                                        <span className="strong">Bước 2:</span>Ép cứng cho <span className="hi-light">{pickedStudents.length} </span>sinh viên
                                    </div>
                                    <div className="step-body">
                                        <ScheduleBoard
                                            pickedStudents={pickedStudents}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}