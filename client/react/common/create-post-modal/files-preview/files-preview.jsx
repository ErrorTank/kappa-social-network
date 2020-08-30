import React from 'react';
import classnames from "classnames"
import {getBase64Image} from "../../../../common/utils/file-upload-utils";
import {LoadingInline} from "../../loading-inline/loading-inline";

class FilePreview extends React.Component {
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
        let {index, length, file} = this.props;
        let {loading, base64Image} = this.state;
        return (
            <div className={classnames("file-preview", `pic-${index + 1}`)}>
                {length > 5 && index === 4 && (
                    <div className="count-overlay">
                        <span>{length - 5} +</span>
                    </div>
                )}
                {loading ? (
                    <LoadingInline/>
                ) : (
                    <img src={file.path || base64Image}/>
                )}
            </div>
        );
    }
}

export const FilesPreview = (props) => {
    let {files, removeAll, toFilesTab} = props;
    return (
        <div className="files-preview">
            <div className="close-wrapper" onClick={removeAll}>
                <i className="fal fa-times"></i>
            </div>
            <div className="fp-actions">
                <button className="btn btn-edit" onClick={toFilesTab}>
                    <i className="fas fa-pen"></i> {files.length > 1 ? "Xem danh sách" : "Chỉnh sửa"}
                </button>
            </div>
            <div className={classnames("fp-list", `list-${files.length < 6 ? files.length : 5 }`)}>
                {files.slice(0, 5).map((each, i) => (
                    <FilePreview
                        key={each?.fileID || each.path}
                        file={each}
                        index={i}
                        length={files.length}
                    />
                ))}
            </div>
        </div>
    );
};
