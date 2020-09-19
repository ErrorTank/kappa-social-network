import React, {Component} from 'react';
import {customHistory} from "../../../routes";
import classnames from "classnames"
import {NavLink} from "react-router-dom";
import {userApi} from "../../../../../api/common/user-api";

export class ProfileNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendsCount: 0
        }
        this.getFriendsCount(props.user._id);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.user._id !== this.props.user._id){
            this.getFriendsCount(this.props.user._id);
        }
    }




    getFriendsCount = (userID) => {
        userApi.getUserFriendsCount(userID).then(({count}) => this.setState({friendsCount: count}));
    };

    render() {
        let {friendsCount} = this.state;
        let  navigators = [
            {
                label: "Dòng thời gian",
                url: `/user/${this.props.user._id}`,

            },{
                label: "Giới thiệu",
                url: `/user/${this.props.user._id}/about`,
            },{
                label: <span>Bạn bè <span className="sub">{friendsCount}</span></span>,
                url: `/user/${this.props.user._id}/friends`,
            },{
                label: "Ảnh",
                url: `/user/${this.props.user._id}/photos`,

            },{
                label: "Videos",
                url: `/user/${this.props.user._id}/videos`,
            },
        ];
        console.log(customHistory)
        return (
            <div className="profile-navigators">
                {navigators.map(each => (
                    <NavLink exact={true} key={each.url} to={each.url} activeClassName={"active"}>
                        <div className="navigator">
                            {each.label}
                        </div>
                    </NavLink>

                ))}
            </div>
        );
    }
}
