import React from 'react';
import classnames from "classnames"
import {getBase64Image} from "../../../../common/utils/file-upload-utils";
import {LoadingInline} from "../../loading-inline/loading-inline";

class FilePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            base64Image: null,
            loading: true
        }
        getBase64Image(props.file.file).then((base64Image) => {

            this.setState({loading: false, base64Image})
        })
    }

    render() {
        let {index} = this.props;
        let {loading, base64Image} = this.state;
        return (
            <div className={classnames("file-preview", `pic-${index}`)}>
                {loading ? (
                    <LoadingInline/>
                ) : (
                    <img src={base64Image}/>
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

            </div>
            <div className={classnames("fp-list", `list-${files.length}`)}>
                {files.map((each, i) => (
                    <FilePreview
                        key={each.fileID}
                        file={each}
                        index={i}
                    />
                ))}
            </div>
        </div>
    );
};
