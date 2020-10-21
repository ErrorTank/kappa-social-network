import React, {Component} from 'react';

class ApField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false
        }
    }

    render() {
        let {isEdit} = this.state;
        let {label, getValue, editable, isExisted, renderForm} = this.props;
        return (
            <div className={"ap-field"}>
                <div className="ap-field-label">
                    {label}
                </div>
                <div className="ap-field-value">
                    {isEdit ? renderForm({onClose: () => this.setState({isEdit: false})}) : (
                        <div className="value">
                            {isExisted() ? getValue() : "Chưa cập nhật"}
                        </div>
                    )}
                </div>
                {!isEdit && (
                    <div className="ap-field-action">
                        {editable && (
                            <div className="edit-btn" onClick={() => this.setState({isEdit: true})}>
                                <i className="far fa-pen"></i> Chỉnh sửa
                            </div>
                        )}
                    </div>
                )}

            </div>
        )
    }
}

export class AboutPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreate: false
        }
    }
    render() {
        let {showCreate} = this.state;
        let {label, icon, createConfig, fields = []} = this.props;
        return (
            <div className="about-panel">
                <div className={"ap-header"}>
                    <div className="ap-label">
                        {icon} {label}
                    </div>
                    {createConfig && createConfig.creatable && (
                        <div className="ap-create-btn" onClick={() => this.setState({showCreate: true})}>
                            {createConfig.createBtn}
                        </div>
                    )}

                </div>
                <div className="ap-body">
                    <div className="ap-fields">
                        {showCreate && createConfig.renderForm({onClose: () => this.setState({showCreate: false})})}
                        {createConfig ? createConfig.list.map((each, i) => (
                            <ApField
                                {...each}
                                key={i}
                            />
                        )) : fields.map((each, i) => (
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

