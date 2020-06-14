import React, {Component} from 'react';
import {LoadingInline} from "../../../../../../common/loading-inline/loading-inline";
import classnames from "classnames"

export class FileDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            base64Image: null,
            loading: props.file.type === "image"
        }
        if(props.file.type === "image"){
            console.log(props.file)
        }
    }
    render() {
        let {base64Image, loading, onClose} = this.props;
        return (
            <div className={classnames("file-display", {"common-file": this.props.file.type !== "image"})}>
                <div className="file-info">
                    <span className="close-icon" onClick={onClose}><i className="fal fa-times"></i></span>
                    {loading && (
                        <LoadingInline/>
                    )}
                </div>
            </div>
        );
    }
}
