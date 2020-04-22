import React, {Component} from 'react';
import {Route} from "react-router";
import {authenCache} from "../../../common/cache/authen-cache";
import {TrackLocation} from "../../common/location-tracker";
import {AuthenLayout} from "../../layout/authen-layout/authen-layout";
import {GuestLayout} from "../../layout/guest-layout/guest-layout";
import {KappaErrorBoundary} from "../../common/kappa-error-boundary/kappa-error-boundary";

export class FlexibleRoute extends Component {
    constructor(props) {
        super(props);
    }

    getComponentLayout = () => {
        if (!authenCache.getAuthen()) {
            return GuestLayout;
        }
        return AuthenLayout;
    };

    render() {
        let {render, component: Component, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={props => {
                    return (
                        <TrackLocation
                            location={window.location.href.replace(document.location.origin, "")}
                            render={() => (
                                <KappaErrorBoundary>
                                    {render ? render(props) : (
                                        <Component
                                            {...props}
                                        />
                                    )}
                                </KappaErrorBoundary>
                            )}
                        />


                    )
                }}
            />
        );
    }
}