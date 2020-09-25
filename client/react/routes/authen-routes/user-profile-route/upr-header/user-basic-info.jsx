import React, {Component} from 'react';
import {CommonInput} from "../../../../common/common-input/common-input";
import {Button} from "../../../../common/button/button";
import {userApi} from "../../../../../api/common/user-api";
import {userInfo} from "../../../../../common/states/common";

export class UserBasicInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: props.user.bio || "",
            edit: false,
            loading: false
        }
    }

    updateBio = () => {
        this.setState({loading: true});
        return userApi.updateUser(this.props.user._id, {
            bio: this.state.bio.trim()
        }) .then((user) => {
            this.setState({
                bio: user.bio,
                loading: false,
                edit: false
            })

        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.user._id !== this.props.user._id){
            this.setState({
                loading: false,
                edit: false,
                bio: this.props.user.bio
            })
        }
    }

    render() {
        let {bio, edit, loading} = this.state;
        let {user, isOwner} = this.props;
        const MAX_LENGTH = 100;
        return (
            <div className="user-basic-info">
                <div className={"username"}>
                    {user.basic_info.username}
                </div>
                {(!edit ? (
                    <div className="bio">
                        {bio && <p>{bio}</p>}
                        {isOwner && (
                            <div className="edit-btn" onClick={() => this.setState({edit: true})}>
                                {bio ? "Chỉnh sửa" : "Thêm bio"}
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="bio-editor">
                        <CommonInput
                            className={"bio-input"}
                            value={bio}
                            textArea={true}
                            onChange={e => {
                                let value = e.target.value.trim();
                                if(value.length <= MAX_LENGTH)
                                    this.setState({bio: e.target.value})
                            }}
                            placeholder={"Mô tả về bạn"}
                        />
                        <div className="bio-left">
                            Còn {MAX_LENGTH - bio.length} ký tự
                        </div>
                        <div className="bio-actions">
                            <Button className={"btn-grey mr-2"} onClick={() => this.setState({bio: user.bio, loading: false, edit: false})}>
                                Hủy
                            </Button>
                            <Button className={"btn-common-primary"} loading={loading} onClick={this.updateBio} disabled={user.bio.trim() === bio.trim()}>
                                Lưu
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}
