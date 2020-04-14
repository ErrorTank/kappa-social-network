import React from "react";
import {Route, Redirect} from "react-router-dom"
import {KComponent} from "../../../common/k-component";
import {authenCache} from "../../../../common/cache/authen-cache";
import {KappaErrorBoundary} from "../../../common/kappa-error-boundary/kappa-error-boundary";
import {AuthenLayout} from "../../../layout/authen-layout/authen-layout";


export class AuthenRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {render, component: Component, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={props => authenCache.getAuthen() ? (
                    <AuthenLayout
                        {...props}
                    >
                        {layoutProps => (
                            <KappaErrorBoundary>
                                {render ? render(props) : (
                                    <Component {...layoutProps} />
                                )}
                            </KappaErrorBoundary>
                        )}
                    </AuthenLayout>
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