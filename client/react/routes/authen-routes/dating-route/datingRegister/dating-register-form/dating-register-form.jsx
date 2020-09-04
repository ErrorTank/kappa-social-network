import React, { Component } from 'react'
import { userApi } from '../../../../../../api/common/user-api';
import { userInfo } from '../../../../../../common/states/common';

export default class Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name : '',
            birthday : {day : 1,month : 1,year: 1900},
            gender : null,
            homeTown : {
                ward :null,
                district : null,
                city : null
            },
            secondarySchool : '',
            university : '',
            height : null,
            location : {
                ward : null,
                district : null,
                city : null
            },
            yourChildren : null,
            educationLevel : null,
            avatar : []
        }
    }
    componentDidMount(){
        userApi.getUserBasicInfo(userInfo.getState()._id).then(data=>{
            console.log(data)
        })
    }
    render() {
        return (
            <div className="container">
                <div className="register-dating-form">

                </div>
                
            </div>
        )
    }
}

