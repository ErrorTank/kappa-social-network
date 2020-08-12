import React from 'react';
import classnames from "classnames"
import {getBase64Image, getImageDimensions} from "../../../../common/utils/file-upload-utils";
import {LoadingInline} from "../../loading-inline/loading-inline";

class FilePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            base64Image: null,
            loading: true,
            width: 0,
            height: 0
        }
        Promise.all([getImageDimensions(props.file.file),getBase64Image(props.file.file)]).then(([{width, height},base64Image]) => {

            this.setState({loading: false, base64Image, width, height})
        })
    }

    render() {
        let {index, length} = this.props;
        let {loading, base64Image, width, height} = this.state;
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
                    <img src={base64Image} style={{width: width >= height ? "auto" : "100%", height: height >= width ? "auto" : "100%"}}/>
                )}
            </div>
        );
    }
}

export const FilesPreview = (props) => {
    let {files, removeAll} = props;
    return (
        <div className="files-preview">
            <div className="close-wrapper" onClick={removeAll}>
                <i className="fal fa-times"></i>
            </div>
            <div className="fp-actions">
                <button className="btn btn-edit">
                    <i className="fas fa-pen"></i> Sửa danh sách
                </button>
            </div>
            <div className={classnames("fp-list", `list-${files.length < 6 ? files.length : 5 }`)}>
                {files.slice(0, 5).map((each, i) => (
                    <FilePreview
                        key={each.fileID}
                        file={each}
                        index={i}
                        length={files.length}
                    />
                ))}
            </div>
        </div>
    );
};
