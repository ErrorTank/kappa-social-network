import React, {Component} from 'react';
import {getBase64Image, isImageFile} from "../../../../../../common/utils/file-upload-utils";

export class MessageFileDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            base64Image: null
        }
        if(props.needUpload && props.file.type === "image"){
            getBase64Image(props.file.file).then((base64Image) => {

                this.setState({ base64Image})
            })
        }
    }
    render() {

        let {base64Image} = this.state;
        let {needUpload, file} = this.props;

        
        return (
            <div className="message-file-display">
                {needUpload ? base64Image ? (
                    <div className="img-wrapper">
                        <img src={base64Image}/>
                    </div>
                ) : (
                    <div className="file-wrapper">
                        <div className="icon-wrapper">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="filename">
                            {file.file.name}
                        </div>
                    </div>
                ) : isImageFile(file.name) ? (
                    <div className="img-wrapper">
                        <img src={file.path}/>
                    </div>
                ) : (
                    <div className="file-wrapper">
                        <div className="icon-wrapper">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="filename">
                            {file.name}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
