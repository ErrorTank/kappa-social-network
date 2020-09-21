import React, {Component} from 'react';
import {Route} from "react-router";

import {TrackLocation} from "../../common/location-tracker";

import {KappaErrorBoundary} from "../../common/kappa-error-boundary/kappa-error-boundary";
import {customHistory} from "../routes";

export class LinkRoute extends Component {
    constructor(props) {
        super(props);
    }



    render() {

        let {render, component: Component, path, ...rest} = this.props;
        return (
            <Route
                {...rest}
                path={customHistory.location.pathname + path}
                render={props => {
                    return (
                        <Component
                            {...props}
                        />


                    )
                }}
            />
        );
    }
}