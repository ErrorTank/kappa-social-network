import React, { Component } from 'react'
import { PageTitle } from './../../../../common/page-title/page-title';
import Header from './header/header'




export class DatingRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount(){ 
    }

    render() {
        return (
            <PageTitle
                title={"Đăng ký hẹn hò"}
            >
                <div className="dating-register">
                    <Header/>   
                </div>
            </PageTitle>
        )
    }
}