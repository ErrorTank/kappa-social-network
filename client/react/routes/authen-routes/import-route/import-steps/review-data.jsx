import React from "react";

export class ReviewData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    mapping = [
        {
            "subjects": {
                mean: "Môn học",
                displayValue: i => i.length
            },
            "eduProgram": {
                mean: "Chương trình học",
                displayValue: i => "Chuyên ngành " + i.speciality.name
            },
            "schoolScheduleItems": {
                mean: "Thời khóa biểu toàn trường",
                displayValue: i => i.length
            },
            "classes": {
                mean: "Lớp học phần",
                displayValue: i => i.length
            },
            "classRooms": {
                mean: "Phòng học",
                displayValue: i => i.length
            },
            "instructors": {
                mean: "Giảng viên",
                displayValue: i => i.length
            },

        }, {
            "result": {
                mean: "Bảng điểm",
            },
            owner: {
                mean: "Sinh viên",
                displayValue: i => i.name + `(${i.identityID})`
            },
            speciality: {
                mean: "Chuyên ngành",
                displayValue: i => i.name
            },
            results: {
                mean: "Môn trong bảng điểm",
                displayValue: i => i.length
            }
        }
    ];

    renderOverviewInfo = (key, value) => {
        let instance = this.mapping[this.props.type][key];
        if(instance){
            if (Array.isArray(value)) {

                return (
                    <>
                        <span className="value">{instance.displayValue(value)}</span>
                        <span className="label">{instance.mean}</span>
                    </>
                )
            }
            return (
                <>
                <span className="label inverse">
                    {instance.mean}
                </span>

                    {
                        instance.displayValue && (
                            <>
                            <span className="value inverse">
                             {instance.displayValue(value)}
                            </span>
                            </>
                        )
                    }

                    {this.mapping[this.props.type][Object.keys(value)[0]] && Object.keys(value).map((each, i) => (
                        <div className="overview-info__child" key={i}>
                            {this.renderOverviewInfo(each, value[each])}
                        </div>
                    ))}

                </>
            )
        }
        return null


    };

    render() {
        let {overview, type} = this.props;
        return (
            <div className="review-data">
                <p className="s-title">Dữ liệu của bạn gồm</p>
                <div className="step-content">
                    {Object.keys(overview).map((k, i) => {
                        return (
                            <div className="overview-info"
                                 key={i}
                            >
                                {this.renderOverviewInfo(k, overview[k])}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}