import React from "react";
import classnames from "classnames";
import {CSSTransition} from "react-transition-group";
import {ThemeContext} from "../../context/theme-context";

export class Tooltip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    };

    render() {
        let {position = "bottom", className, text, onShow = () => null, onHide = () => null} = this.props;
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <div className={classnames("tooltip-container", className, {darkMode})}
                         onMouseEnter={() => {
                             this.setState({show: true});
                             onShow();
                         }}
                         onMouseLeave={() => {
                             this.setState({show: false});
                             onHide();
                         }}
                    >
                        {this.props.children}
                        <CSSTransition in={this.state.show} timeout={300} classNames={"fade"}>
                            {this.state.show ? (
                                <div className={classnames("tool-tip", position)}>
                                    <div className="tooltip-content">
                                        {text()}
                                    </div>
                                </div>
                            ) : (
                                <span style={{display: "none"}}></span>
                            )}

                        </CSSTransition>

                    </div>
                )}

            </ThemeContext.Consumer>

        );
    }
}