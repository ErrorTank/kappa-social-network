import React, {Component} from 'react';
import {NameForm} from "./forms/name-form";

class ApField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false
        }
    }

    render() {
        let {isEdit} = this.state;
        let {label, getValue, editable, isExisted, renderForm, isList = false, isVisible = () => true} = this.props;
        return isVisible() ? (
            <div className={"ap-field"}>
                {((isList && !isEdit) || !isList) && (
                    <div className="ap-field-label">
                        {label}
                    </div>
                ) }

                <div className="ap-field-value">
                    {isEdit ? renderForm({onClose: () => this.setState({isEdit: false}), isCreate: false}) : (
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
        ) : null
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
                        {showCreate && createConfig.itemConfig.renderForm({onClose: () => this.setState({showCreate: false})})}
                        {createConfig ? createConfig.list.map((each, i) => (
                            <ApField
                                key={i}
                                {...createConfig.itemConfig}
                                isList={true}
                                getValue={() => createConfig.itemConfig.getValue(each)}
                                renderForm={config => createConfig.itemConfig.renderForm({...config, item: each})}
                                isVisible={() => createConfig.itemConfig.isVisible(each)}
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

