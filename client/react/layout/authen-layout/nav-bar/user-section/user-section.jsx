import React from "react";
import {Avatar} from "../../../../common/avatar/avatar";
import {userInfo} from "../../../../../common/states/common";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {customHistory} from "../../../../routes/routes";
import classnames from "classnames"
import {authenCache} from "../../../../../common/cache/authen-cache";

export class UserSection extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isDropdown: false
        };
    };



    items = [
        {
            label: "Thông tin cá nhân",
            icon: <PersonOutlineIcon
                    fontSize={"inherit"}
            />,
            url: "/profile"
        },{
            label: "Đăng xuất",
            icon: <ExitToAppIcon fontSize={"inherit"}/>,
            onClick: () => {
                userInfo.setState(null);
                authenCache.clearAuthen();
                customHistory.push("/login");
            }
        },
    ];

    render(){
        let {isDropdown} = this.state;
        let {location} = customHistory;
        let info = userInfo.getState();
        return(
            <div className="user-section"
                onMouseEnter={() => this.setState({isDropdown: true})}
                onMouseLeave={() => this.setState({isDropdown: false})}
            >
                <Avatar
                    round={true}
                    name={info.name}
                    size={"small"}
                />
                <span className="full-name">
                    {info.name}
                </span>
                <KeyboardArrowDownIcon/>

                {isDropdown && (
                    <div className="user-dropdown">
                        <div className="dropdown-content">

                            <span className="decorate">
                </span>
                            {this.items.map((item) => (
                                <div className={classnames("dropdown-item", {active: item.url ? location.pathname === item.url : false})}
                                     key={item.label}
                                     onClick={() => {
                                         if(item.url){
                                             customHistory.push(url);
                                         }else{
                                             item.onClick();
                                         }
                                     }}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )

                }

            </div>
        );
    }
}