import React, {Component} from 'react';
import classnames from "classnames";

export class IconRoundBorderInput extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const {className, id, icon,darkMode,  ...others} = this.props;
        return (
            <div className={classnames("icon-round-border-input", {darkMode})}>
                <div className="input-wrapper">
                    {icon && <span className="irbi-icon">{icon}</span>}
                    <input className={classnames("irbi-input")} type={"text"} id={id} {...others}/>
                </div>
            </div>
        );
    }
}
