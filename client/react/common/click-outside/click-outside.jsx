import React from "react";
import ReactDOM from "react-dom";
import {KComponent} from "../k-component";

export class ClickOutside extends KComponent {

    constructor(props) {
        super(props);

        this.onUnmount(() => {
            if(this.cancelClickOutside) {
                this.cancelClickOutside();
                this.cancelClickOutside = null;
            }

        })
    }

    cancelClickOutside = null;

    componentDidMount() {
        this.cancelClickOutside = this.clickOutside();
    }

    clickOutside = () => {
        this.clickFunc = (e) => {
            let elem = ReactDOM.findDOMNode(this);
            if(!elem || !elem.contains(e.target)) {
                this.props.onClickOut(e);
            }
        };
        // window.addEventListener('mousedown', this.clickFunc);
        window.addEventListener('click', this.clickFunc);
        window.addEventListener("touchstart", this.clickFunc);

        return () => {
            // window.removeEventListener('mousedown', this.clickFunc);
            window.removeEventListener('click', this.clickFunc);
            window.removeEventListener("touchstart", this.clickFunc);
        };
    };

    render() {
        return React.Children.only(this.props.children);
    }
}