import React, { Component } from 'react'
import { PageTitle } from './../../../common/page-title/page-title';
import { datingApi } from '../../../../api/common/dating';
import { userInfo, datingProfile } from './../../../../common/states/common';
import { customHistory } from './../../routes';
import {DatingRegister} from './datingRegister/datingRegister';

export default class DatingRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            loading: true,
        }
    }

    componentDidMount(){
       datingApi.checkDatingProfile(userInfo.getState()._id)
       .then(profile => {
           if(profile){
            this.setState({
                profile,
                loading: false
            })
          
           }else{
            this.setState({
                profile: null,
                loading: false
            })
           }
           
       })
    }

    render() {
        let {profile} = this.state;
        return (
            <div className="dating-route">
                   
            {profile ? (
                 <PageTitle
                 title={"Hẹn hò"}
             >
                
             </PageTitle>
            ) : (
                <DatingRegister/>
            )}
        </div>
            
        )
    }
}
