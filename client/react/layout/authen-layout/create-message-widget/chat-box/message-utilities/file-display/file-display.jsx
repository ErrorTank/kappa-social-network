import React, {Component} from 'react';
import {LoadingInline} from "../../../../../../common/loading-inline/loading-inline";
import classnames from "classnames"
import {getBase64Image} from "../../../../../../../common/utils/file-upload-utils";


export class FileDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            base64Image: null,
            loading: props.file.type === "image"
        }
        if(props.file.type === "image"){
            getBase64Image(props.file.file).then((base64Image) => {
                console.log(base64Image);
                this.setState({loading: false, base64Image})
            })
        }
    }
    render() {
        let {onClose} = this.props;
        let {base64Image, loading} = this.state;
        return (
            <div className={classnames("file-display", {"common-file": this.props.file.type !== "image"})}>
                <div className="file-info">
                    <span className="close-icon" onClick={onClose}><i className="fal fa-times"></i></span>
                    {loading && (
                        <LoadingInline/>
                    )}
                    {base64Image ? (
                        <div className="img-wrapper">
                            <img src={base64Image}/>
                        </div>
                    ) : (
                        <div className="file-wrapper">
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
