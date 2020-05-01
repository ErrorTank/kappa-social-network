import React, {Component} from 'react';
import classnames from "classnames";

export class CreateMessageWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreatePanel: false
        }
    }
    render() {
        let {showCreatePanel} = this.state;
        let {darkMode} = this.props;
        return (
            <div className={classnames("create-message-widget", {darkMode})}>
                <div className="cmw-container">
                    <div className="cmw-toggle"
                         onClick={e => {
                             e.stopPropagation();
                             this.setState({showCreatePanel: !showCreatePanel});
                         }}
                    >
                        <i className="fas fa-comment-plus"></i>
                    </div>
                    {showCreatePanel && (
                        <div className="cmw-panel">
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
