import React, {Fragment} from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {schoolScheduleApi} from "../../../../api/common/school-schedule-api";
import {modals} from "../modals";
import classnames from "classnames";
import uniq from "lodash/uniq"

export const disabledClassModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <DisabledClassModal
                    {...config}
                    onClose={() => modal.close()}
                />
            )
        });
        return modal.result;
    }
};

class DisabledClassModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            lessons: [],
            loading: true,
            isSuccess: false,
            disabling: false
        };
        schoolScheduleApi.getSubjectLessonsByScheduleItems(props.classes).then(lessons => this.setState({lessons, loading: false}));
    };

    handleDisabledClass = () => {
        let {lessons} = this.state;
        let idsArrayRoot = lessons.reduce((result, each) => result.concat(each.lessons.map(l => l._id)),[]);
        this.setState({disabling: true});
        schoolScheduleApi.disabledSchoolScheduleItems(uniq(idsArrayRoot)).then(() => this.setState({disabling: false, isSuccess: true}))
    };

    render(){
        let {lessons, loading, isSuccess, disabling} = this.state;
        let {onClose} = this.props;
        return(
            <div className={"disabled-class-modal common-modal"}>
                <div className="modal-header">
                    <div className="modal-title">
                        {isSuccess ? "Thông báo" : "Xác nhận hủy lớp"}
                    </div>
                    <i className="fas fa-times close-modal"
                       onClick={() => onClose()}
                    />
                </div>
                <div className="modal-body">
                    <div className="lessons-container">
                        {loading ? (
                            <LoadingInline/>
                        ) : isSuccess ? (
                            <div className="success-notify">
                                <i className="fad fa-check-circle"></i><span>Hủy môn thành công!</span>
                            </div>
                        ) : (
                            <>
                                <div className="dcm-modal-title"><span>{lessons.length}</span> nhóm lớp sẽ bị hủy</div>
                                <div className="lessons">
                                    {lessons.map((each, i) => {
                                        let isSame = each.lessons.filter(i => i.class.name === each.lessons[0].class.name).length === each.lessons.length;
                                        return (
                                            <div className="each-lesson" key={i}>
                                                <span className="lesson-order">{i + 1}.</span>
                                                {isSame ? (
                                                    <span className="lesson-class">
                                                        <span className="class-name">{each.lessons[0].class.name}</span>
                                                        {each.lessons.map((l) => {
                                                            return (
                                                               <Fragment key={l._id}>
                                                                   <span className="day">{l.dayOfWeek < 7 ? "Thứ " + (l.dayOfWeek + 1) : "Chủ nhật"}:</span>
                                                                   <span className="shift">Ca {l.from.name} - Ca {l.to.name}</span>
                                                                   <span className={classnames("slot", {notReachMin: l.state < l.class.capacity.min})}>{l.state}/{l.class.capacity.max}</span>
                                                               </Fragment>
                                                            )
                                                        })}
                                                    </span>
                                                ) : each.lessons.map(l => {

                                                    return (
                                                        <span className="lesson-class" key={l._id}>
                                                            <span className="class-name">{l.class.name}</span>
                                                            <span className="day">{l.dayOfWeek < 7 ? "Thứ " + (l.dayOfWeek + 1) : "Chủ nhật"}:</span>
                                                            <span className="shift">Ca {l.from.name} - Ca {l.to.name}</span>
                                                            <span className={classnames("slot", {notReachMin: l.state < l.class.capacity.min})}>{l.state}/{l.class.capacity.max}</span>
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-cancel" onClick={() => onClose()}>
                        {isSuccess ? "Đóng" : "Hủy bỏ"}
                    </button>
                    {!isSuccess && (
                        <button type="button" className="btn btn-confirm" onClick={this.handleDisabledClass}>
                            Đồng ý
                            {
                                disabling && (
                                    <LoadingInline/>
                                )
                            }
                        </button>
                    )}

                </div>
            </div>
        );
    }
}