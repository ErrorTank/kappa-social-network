import React from "react";
import {Route, Redirect} from "react-router-dom"
import {KComponent} from "../../../common/k-component";
import {authenCache} from "../../../../common/cache/authen-cache";
import {KappaErrorBoundary} from "../../../common/kappa-error-boundary/kappa-error-boundary";


export class GuestRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {render, component: Component, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={props => !authenCache.getAuthen() ? render ? render(props) : (
                    <KappaErrorBoundary>
                        <Component {...props} />
                    </KappaErrorBoundary>
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                        }}
                    />
                )}
            />
        );
    }
}
