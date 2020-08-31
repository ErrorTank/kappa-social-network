import React from 'react';
import {getBase64Image} from "../../../../../common/utils/file-upload-utils";
import classnames from "classnames";
import {LoadingInline} from "../../../loading-inline/loading-inline";

export class FileDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            base64Image: null,
            loading: !props.file.path,
        }
        !props.file.path && getBase64Image(props.file.file).then((base64Image) => {

            this.setState({loading: false, base64Image})
        })
    }

    render() {
        let {loading, base64Image} = this.state;
        let {onSelect, onRemove, file} = this.props;
        return (
            <div className={classnames("fl-file-display")}>
                <div className="media-container">
                    {loading ? (
                        <LoadingInline/>
                    ) : (
                        <img src={file.path || base64Image}/>
                    )}
                    <div className="actions">
                        <div>
                            <button className="btn btn-grey" onClick={onSelect}>
                                <i className="fas fa-pen"></i> Chỉnh sửa
                            </button>
                            <div className="round-icon-wrapper" onClick={onRemove}>
                                <i className="fal fa-times"></i>
                            </div>
                        </div>

                    </div>
                </div>
                {file.caption && (
                    <div className="file-caption">
                        {file.caption}
                    </div>
                )}

            </div>
        );
    }
}