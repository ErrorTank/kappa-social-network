import React, {Component} from 'react';
import {CommonInput} from "../../common-input/common-input";
import {TaggedBox} from "../../tagged-box/tagged-box";
import {getBase64Image} from "../../../../common/utils/file-upload-utils";
import pick from "lodash/pick";
import {ImageTagWrapper} from "../../image-tag-wrapper/image-tag-wrapper";
import {utilityApi} from "../../../../api/common/utilities-api";

export class FileConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caption: props.file.caption || "",
            tagged: props.file.tagged || [],
            base64Image: null,
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
                        placeholder={"Nhập chú thích"}
                        onChange={e => this.setState({caption: e.target.value})}
                    />
                    {!!tagged.length && (
                        <TaggedBox
                            list={tagged}
                            label={"Được gắn thẻ trong ảnh"}
                            displayAs={each => each.related.basic_info.username}
                            onRemove={tagged => this.setState({tagged})}
                            getKey={each => each.related._id}
                            deleteCondition={(t1, t2) => t1.related._id !== t2.related._id}
                        />
                    )}
                </div>
                <div className="right-panel">
                    <div className="overlay-container">
                        <p className="tag-title">
                            Nhấn vào ảnh để tag bạn bè
                        </p>
                        <ImageTagWrapper
                            file={this.props.file.file}
                            tagged={tagged}
                            className={"image-wrapper"}
                            api={({keyword}) => utilityApi.searchFriends(keyword)}
                            isTagged={user => tagged.find(item => item.related._id === user._id)}
                            onSelect={(user, ratioX, ratioY) => {
                                this.setState({tagged: tagged.concat({related: user, ratioX, ratioY})})
                            }}
                            onRemove={tag => this.setState({tagged: tagged.filter(each => each.related._id !== tag.related._id)})}
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

