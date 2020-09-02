import React, {Component} from 'react';
import classnames from "classnames"
import {ClickOutside} from "../click-outside/click-outside";
import {ThemeContext} from "../../context/theme-context";

export class Dropdownable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    render() {
        let {className, toggle, content, showArrow = true, position} = this.props;

        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <ClickOutside onClickOut={() => this.setState({show: false})}>
                        <div className={classnames("dropdownable", className, {darkMode, center: position === "center"})}>
                            <div className={classnames("dropdownable-toggle", {active: this.state.show})}
                                 onClick={() => this.setState({show: !this.state.show})}>

                                {toggle()}
                            </div>
                            {this.state.show && (

                                <div className="dropdown">
                                    <div className="content-wrapper">
                                        {showArrow && (
                                            <div className="arrow"/>

                                        )}
                                        {content({
                                            close: () => this.setState({show: false})
                                        })}
                                    </div>

                                </div>


                            )}
                        </div>
                    </ClickOutside>
                )}

            </ThemeContext.Consumer>

        );
    }
}
