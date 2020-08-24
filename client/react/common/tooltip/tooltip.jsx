import React from "react";
import classnames from "classnames";
import {CSSTransition} from "react-transition-group";
import {ThemeContext} from "../../context/theme-context";
import debounce from "lodash/debounce"

export class Tooltip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    };

    setShow = debounce(() => {
        this.setState({show: true});
        this.props.onShow?.();
    }, this.props.delay || 0)

    render() {
        let {position = "bottom", className, text, onShow = () => null, onHide = () => null, disabled = false} = this.props;
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <div className={classnames("tooltip-container", className, {darkMode})}
                         onMouseEnter={this.setShow}
                         onMouseLeave={() => {
                             this.setState({show: false});
                             onHide();
                         }}
                    >
                        {this.props.children}
                        <CSSTransition in={this.state.show} timeout={300} classNames={"fade"}>
                            {(this.state.show && !disabled) ? (
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