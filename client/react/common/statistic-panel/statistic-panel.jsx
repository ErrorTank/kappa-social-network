import React from "react";
import classnames from "classnames"

export class StatisticPanel extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        let {statistics} = this.props;
        return(
            <div className="statistic-panel">
                {statistics.map((each, i) => {
                    return (
                        <div className={classnames("statistic-item", `style-${each.style}`)} key={i}>
                           <div className="item-main">
                               <div className="content">
                                   <p className="value">{each.value}</p>
                                   <p className="label">{each.label}</p>
                               </div>
                               <div className="icon">
                                   {each.icon}
                               </div>
                           </div>
                        </div>
                    )
                })}
            </div>
        );
    }
}