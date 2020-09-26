import React, {Component} from 'react';

export class AboutPanel extends Component {
    render() {
        let {label, icon} = this.props;
        return (
            <div className="about-panel">
                <div className={"ap-header"}>
                    <div className="ap-label">
                        {icon} {label}
                    </div>
                </div>
            </div>
        );
    }
}

