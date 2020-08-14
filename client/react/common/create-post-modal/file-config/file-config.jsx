import React, {Component} from 'react';
import {CommonInput} from "../../common-input/common-input";
import {TagBox} from "../../tag-box/tag-box";
import {getBase64Image, getImageDimensions} from "../../../../common/utils/file-upload-utils";
import pick from "lodash/pick";

export class FileConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caption: props.file.caption || "",
            tagged: props.file.tagged || [],
            base64Image: null,
            loading: true,
            width: 0,
            height: 0
        }
        Promise.all([getBase64Image(props.file.file), getImageDimensions(props.file.file)]).then(([base64Image, {width, height}]) => {

            this.setState({loading: false, base64Image, width, height})
        })
    }

    save = () => {
        this.props.onChange({...this.props.file, ...pick(this.state, ["caption", "tagged"])});
    }

    render() {
        let {caption, tagged, width, height, loading, base64Image} = this.state;
        let ratio = width / height;
        let baseWidth = (width <= 640 ? width : 640);
        let baseHeight = (height <= 400 ? height : 400);
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
                        <div className="image-wrapper" style={{
                            width: width >= height ? baseWidth : baseHeight * ratio,
                            height: width >= height ? baseWidth / ratio : baseHeight
                        }}>
                            {!loading && (
                                <img src={base64Image}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

