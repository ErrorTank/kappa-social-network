import React, {Component} from 'react';
import {CommonInput} from "../../common-input/common-input";
import {TagBox} from "../../tag-box/tag-box";

export class FileConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caption: props.file.caption || "",
            tagged: props.file.tagged || []
        }
    }

    save = () => {
        this.props.onChange({...this.props.file, ...this.state});
    }

    render() {
        let {caption, tagged} = this.state;
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

                </div>
            </div>
        );
    }
}

