import React, {Component} from 'react';
import {CommonInput} from "../../../../common/common-input/common-input";

export class AdminPdtForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        props.form.validateData();
    }

    render() {
        let {form, isEdit} = this.props;
        return (
            <div className="admin-pdt-form common-form">
                <div className="form-row">

                </div>
            </div>
        );
    }
}
