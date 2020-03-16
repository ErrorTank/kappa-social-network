import React from "react";
import {Sidebar} from "./side-bar/side-bar";
import {Navbar} from "./nav-bar/nav-bar";
import {Breadcrumbs} from "../../common/breadcrumbs/breadcrumbs";
import {commonPopup, CommonPopupRegistry} from "../../common/common-popup/common-popup";
import {userInfo} from "../../../common/states/common";
import {mapRoleToDefaultPath} from "../../routes/route-types/role-filter-route";


export class AuthenLayout extends React.Component {
    constructor(props) {
        super(props);

    };



    render() {
        return (
            <div className="authen-layout">
                {commonPopup.installPopup("common-popup",{
                    renderLayout:  props => <CommonPopupRegistry {...props}/>,
                    autoHide: true
                })}
                <Navbar/>
                <Sidebar/>
                <div className="main-content">

                    <Breadcrumbs

                    >
                        {this.props.children()}


                    </Breadcrumbs>
                </div>
            </div>
        );
    }
}