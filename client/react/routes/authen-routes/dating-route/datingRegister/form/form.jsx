import React, { Component } from 'react'

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
    render() {
        return (
            <div className="container">
                <div className="register-dating-form">

                </div>
                
            </div>
        )
    }
}

