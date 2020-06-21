import React, {Component} from 'react';
import {KComponent} from "../k-component";
import ReactDOM from "react-dom";
import {checkElemInContainerView} from "../../../common/utils/dom-utils";

export class InfiniteScrollWrapper extends KComponent {
    constructor(props) {
        super(props);


        this.onUnmount(() => {
            if (this.cancelAction) {
                this.cancelAction();
                this.cancelAction = null;
            }

        })
    }

    cancelAction = null;

    componentDidMount() {
        this.cancelAction = this.bindActionToScroll();
    }




    bindActionToScroll = () => {
        let elem = ReactDOM.findDOMNode(this);

        this.scrollFunc = (e) => {
            let elemClone = ReactDOM.findDOMNode(this);

            if (elemClone.scrollTop === 0) {

                // console.log(elemClone.clientHeight)

                this.props.onScrollTop();
            } else if (elemClone.scrollTop + elem.clientHeight >= elem.scrollHeight) {

                this.props.onScrollBottom(e);
            } else {
                this.props.onScroll(e)
            }

        };
        elem.addEventListener('scroll', this.scrollFunc);


        return () => {
            elem.removeEventListener('scroll', this.scrollFunc);
        };
    };



    render() {
        return this.props.children
    }
}