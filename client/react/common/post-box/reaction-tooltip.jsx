import React, {Component} from 'react';
import {LoadingInline} from "../loading-inline/loading-inline";


export class ReactionTooltip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            fetching: true
        }
        props.api().then(list => this.setState({list, fetching: false}))

    }



    render() {
        let {list,fetching} = this.state;
        return (
            <div className="reaction-tooltip">
                <div className="loading-wrapper">
                    {fetching && (
                        <LoadingInline/>
                    )}
                </div>

            </div>
        );
    }
}

