import React, {Component} from 'react';
import {CommonInput} from "../../common-input/common-input";
import {TagBox} from "../../tag-box/tag-box";
import {getBase64Image} from "../../../../common/utils/file-upload-utils";
import pick from "lodash/pick";
import {ImageTagWrapper} from "../../image-tag-wrapper/image-tag-wrapper";

export class FileConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caption: props.file.caption || "",
            tagged: props.file.tagged || [],
            base64Image: nul,
            loading: true,
        }
        getBase64Image(props.file.file).then((base64Image) => {

            this.setState({loading: false, base64Image})
        })
    }

    save = () => {
        this.props.onChange({...this.props.file, ...pick(this.state, ["caption", "tagged"])});
    }

    render() {
        let {caption, tagged, loading, base64Image} = this.state;

        return (
            <div className="file-config">
                <div className="left-panel">
                    <CommonInput
                        className={"caption-input"}
                        value={caption}
                        label={"Chú thích ảnh"}
                        type={"text"}
                        textArea={true}
                        onChange={e => this.setState({caption: e.target.value})}
                    />
                    <TagBox
                        list={tagged}
                        label={"Được gắn thẻ trong ảnh"}
                        displayAs={each => each.basic_info.username}
                        onRemove={item => this.setState({tagged: this.state.tagged.filter(each => each._id !== item._id)})}
                    />
                </div>
                <div className="right-panel">
                    <div className="overlay-container">
                        <p className="tag-title">
                            Nhấn vào ảnh để tag bạn bè
                        </p>
                        <ImageTagWrapper
                            file={this.props.file.file}
                            className={"image-wrapper"}
                        >
                            {() => {
                                return !loading && (
                                    <img src={base64Image}/>
                                )
                            }}
                        </ImageTagWrapper>

                    </div>
                </div>
            </div>
        );
    }
}

