import React from "react";
import classnames from "classnames";

export class MultipleTabWidget extends React.Component{
    constructor(props){
        super(props);
        this.state={
            index: props.initIndex || 0
        };
    };
    render(){
        let {tabs} = this.props;
        let renderFunc = tabs[this.state.index].render;
        return(
            <div className="multiple-tab-widget">
                <div className="navigator">
                    {tabs.map((each, i) => (
                        <div className={classnames("each-nav", {active: i === this.state.index, disabled: each.isDisabled ? each.isDisabled() : false})} key={i} onClick={() => {
                            i !== this.state.index && this.setState({index: i});
                        }}>
                            {each.label}
                        </div>
                    ))}
                </div>
                <div className="content">
                    {renderFunc()}
                </div>
            </div>
        );
    }
}