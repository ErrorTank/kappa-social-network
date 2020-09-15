import React, {Component} from 'react';
import {KComponent} from "../k-component";
import ReactDOM from "react-dom";
import classnames from "classnames";

export class InfiniteScrollWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

        this.observer = null;
        this.lastTopY = 0;
        this.lastBottomY = 0;
    }


    componentDidMount() {
        this.refresh();
        let root = ReactDOM.findDOMNode(this)
        this.observer = new IntersectionObserver(this.handleObserver, {
            root: this.props.useWindowRoot ? null : root,
            threshold: 1,
            rootMargin: "0px"
        });
        this.observer.observe(this.top);
        this.observer.observe(this.bottom);
    }


    handleObserver = (entries, observer) => {
        entries.forEach(entry => {


            if(entry.target.id === 'top'){

                if(this.lastTopY < entry.boundingClientRect.y){
                    this.props.onScrollTop?.()
                }

                this.lastTopY = entry.boundingClientRect.y;
            }
            else if(entry.target.id === 'bottom'){

                if(this.lastBottomY > entry.boundingClientRect.y){
                    this.props.onScrollBottom?.();
                }

                this.lastBottomY = entry.boundingClientRect.y;
            }

        });
    }

    refresh = () => {
        this.lastTopY = ReactDOM.findDOMNode(this.top).getBoundingClientRect().y;
        this.lastBottomY = ReactDOM.findDOMNode(this.bottom).getBoundingClientRect().y;
    }



    render() {

        return (
            <div
                className={classnames("infinite-scroll-wrapper", this.props.className)}
            >
                <div ref={top => this.top = top} id={"top"}/>
                    {this.props.children({ refresh: this.refresh})}
                <div ref={bottom => this.bottom = bottom} id={"bottom"}/>

            </div>
        )
    }
}
