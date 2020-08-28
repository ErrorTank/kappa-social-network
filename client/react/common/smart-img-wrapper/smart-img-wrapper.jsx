import React, {Component} from 'react';
import classnames from "classnames"

export class SmartImgWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let {className} = this.props;
        return (
            <div className={classnames("smart-img-wrapper", className)}>

            </div>
        );
    }
}
