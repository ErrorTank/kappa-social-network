import React from "react";

export class DataTypePicker extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };



    render(){
        let {onChange} = this.props;
        return(
            <div className="data-type-picker">
                <div className="option"
                     onClick={() => onChange(0)}
                >
                    Chương trình học & TKB toàn trường
                </div>
                <div className="separate">
                    <span></span>
                    <span>hoặc</span>
                    <span></span>
                </div>
                <div className="option"
                     onClick={() => onChange(1)}
                >
                    Bảng điểm cá nhân
                </div>
            </div>
        );
    }
}