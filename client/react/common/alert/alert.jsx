import React from "react";
import classnames from "classnames";

export class Alert extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        let {className, type = "icon", color = "danger", onClick = () => null, onClickClose = null, icon, content, strongText = ""} = this.props;
        return(
            <div className={classnames(`common-alert ${type}-alert ${color}-alert`, className)}
                 onClick={onClick}
            >
                {onClickClose && (
                    <i className="fal fa-times-circle" onClick={onClickClose}></i>
                )}
                {icon && (
                    <span className="alert-icon">
                        {icon}
                    </span>
                )}
                <div className="content">
                    <strong>{strongText}</strong>
                    {content}
                </div>
            </div>
        );
    }
}