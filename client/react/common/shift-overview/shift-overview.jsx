import React from "react";
import {shiftsCache} from "../../../common/cache/api-cache/common-cache";
import {LoadingInline} from "../loading-inline/loading-inline";

export class ShiftOverview extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading: true,
            shifts: []
        };
        shiftsCache.get().then(shifts => {
            this.setState({shifts, loading: false})
        })
    };
    render(){
        return(
            <div className={"shift-overview"}>
                {this.state.loading ? (
                    <LoadingInline/>
                ) : (
                    <div className="shifts">
                        <p className="shift-title">
                            Tra cứu thời gian ca học
                        </p>
                        {this.state.shifts.map(each => (
                            <div className="shift" key={each._id}>
                                <div className="label">
                                    Ca {each.name}
                                </div>
                                <div className="value">
                                    {each.from} - {each.to}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}