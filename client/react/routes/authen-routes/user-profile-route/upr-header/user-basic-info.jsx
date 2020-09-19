import React, {Component} from 'react';
import {CommonInput} from "../../../../common/common-input/common-input";

export class UserBasicInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: props.user.bio || "",
            edit: false
        }
    }

    render() {
        let {bio, edit} = this.state;
        let {user, isOwner} = this.props;
        return (
            <div className="user-basic-info">
                <div className={"username"}>
                    {user.basic_info.username}
                </div>
                {isOwner && !edit ? (
                    <div className="bio">
                        {bio && <p>{bio}</p>}
                        <div className="edit-btn" onClick={() => this.setState({edit: true})}>
                            {bio ? "Chỉnh sửa" : "Thêm bio"}
                        </div>
                    </div>
                ) : (
                    <div className="bio-editor">
                        <CommonInput

                        />
                    </div>
                )}
            </div>
        );
    }
}
