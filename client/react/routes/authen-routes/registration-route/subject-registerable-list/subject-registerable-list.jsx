import React from "react";
import classnames from "classnames";
import {RegistrationDetails} from "../registration-details";

export class SubjectRegisterableList extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        let {pickedSubject, subjectList, subject, schedule, onRegister, toggleRegister} = this.props;
        return(
            <div className="subject-registerable-list">
                <div className="list-container">
                    {subjectList.map(each => {
                        return (
                            <div
                                className={classnames("registration-subject", {active: pickedSubject && (pickedSubject === each._id)})}
                                key={each._id}
                                onClick={() => {
                                    let isToggle = pickedSubject && each._id === pickedSubject;
                                    this.props.onChange(isToggle ? null : each._id)
                                }}

                            >
                                <div className="s-name">{each.name}</div>
                            </div>
                        )
                    })}
                </div>
                {pickedSubject && (
                    <RegistrationDetails
                        schedule={schedule}
                        subject={subject}
                        onRegister={onRegister}
                        onUnregister={toggleRegister}
                    />
                )}
            </div>
        );
    }
}