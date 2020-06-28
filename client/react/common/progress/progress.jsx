import React from "react"
import classnames from "classnames"

export class Progress extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        let {className, progress} = this.props;
        return (
            <div className={classnames("progress-bar", className)}>
                <div
                    className="progress"
                    style={{ width: progress + '%' }}
                />
            </div>
        )
    }
}

