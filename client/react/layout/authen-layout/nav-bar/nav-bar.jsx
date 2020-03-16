import React from "react";
import {UserSection} from "./user-section/user-section";
import {commonPopup, CommonPopupRegistry} from "../../../common/common-popup/common-popup";

export class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        return(
            <div className="nav-bar">

                <div className="nav-bar__logo">
                    <a href={"/"}>
                        <div className="img-wrapper">
                            <img className="logo-img" src={"/assets/images/logotlu.jpg"}/>
                        </div>
                        <span></span>
                        <p>Đăng ký học</p>
                    </a>
                </div>
                <div className="nav-bar__main">
                    <div className="nav-bar__main--wrapper">
                        <UserSection/>
                    </div>

                </div>
            </div>
        );
    }
}