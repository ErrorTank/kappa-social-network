import React, {Component} from 'react';
import {getBase64Image} from "../../../../common/utils/file-upload-utils";
import {LoadingInline} from "../../loading-inline/loading-inline";

export class CommentMedia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            base64Image: null,
            loading: true,
        }
        getBase64Image(props.file.file).then((base64Image) => {

            this.setState({loading: false, base64Image})
        })
    }
    render() {
        let {loading, base64Image} = this.state;
        return (
            <div className="comment-media">
                {loading ? (
                    <LoadingInline/>
                ) : (
                    <img src={base64Image}/>
                )}
                <i className="far fa-times remove-icon" onClick={this.props.onRemove}></i>
            </div>
        );
    }
}

