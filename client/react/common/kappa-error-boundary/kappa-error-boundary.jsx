import React from "react";


export class KappaErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error);
        console.log(errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    render() {
        if (this.state.error) {
            return (
                <div className="component-error-fallback">
                    Something when wrong!
                </div>
            );
        }

        return this.props.children;
    }
}