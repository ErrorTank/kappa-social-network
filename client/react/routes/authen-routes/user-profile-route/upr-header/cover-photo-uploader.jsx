import React, {Component} from 'react';

export class CoverPhotoUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: props.src,
            file: null,

        }
    }
    render() {
        let {file, imgSrc} = this.state;
        return (
            <div className="cover-photo-uploader">
                {imgSrc && (
                    <img src={imgSrc}/>
                )}

                {file && (
                    <div className="upload-actions">
                    </div>
                )}
            </div>
        );
    }
}

