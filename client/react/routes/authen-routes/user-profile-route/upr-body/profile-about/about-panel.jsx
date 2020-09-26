import React, {Component} from 'react';

class ApField extends Component {
    render() {
        let {label, getValue, editable, isExisted} = this.props;
        return (
            <div className={"ap-field"}>
                <div className="ap-field-label">
                    {label}
                </div>
                <div className="ap-field-value">
                    {isExisted() ? getValue() : "Chưa cập nhật"}
                </div>
                <div className="ap-field-action">
                    {editable && (
                        <div className="edit-btn">
                            <i className="far fa-pen"></i> Chỉnh sửa
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export class AboutPanel extends Component {
    render() {
        let {label, icon, createConfig, fields = []} = this.props;
        return (
            <div className="about-panel">
                <div className={"ap-header"}>
                    <div className="ap-label">
                        {icon} {label}
                    </div>
                    {createConfig && (
                        <div className="ap-create-btn">
                            {createConfig.createBtn}
                        </div>
                    )}

                </div>
                <div className="ap-body">
                    <div className="ap-fields">
                        {fields.map((each, i) => (
                            <ApField
                                {...each}
                                key={i}
                            />
                        ))}
                    </div>

                </div>
            </div>
        );
    }
}

