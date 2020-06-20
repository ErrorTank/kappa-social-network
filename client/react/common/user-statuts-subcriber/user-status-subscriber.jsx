
import {messengerIO} from "../../../socket/sockets";
import React, {Component} from 'react';

export class WithUserStatus extends Component {
    constructor(props) {
        super(props);
        this.state = props.status ? {...props.status} : {
            active: false,
            last_active_at: null
        };
        this.io = messengerIO.getIOInstance();
        if(props.userID){
            this.io.on("change-contact-status", ({active, userID, last_active_at}) => {
                if(userID === props.userID){
                    this.setState({active, last_active_at});
                }
            });
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.userID && (nextProps.userID !== this.props.userID)){
            this.setState({active: nextProps.status.active, last_active_at: nextProps.status.last_active_at});
            this.io.on("change-contact-status", ({active, userID, last_active_at}) => {
                if(userID === nextProps.userID){
                    this.setState({active, last_active_at});
                }
            });
        }

    }

    componentWillUnmount() {
        this.io.off("change-contact-status");
    }

    render() {
        return this.props.children(this.state)
    }
}


