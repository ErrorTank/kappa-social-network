import React, {Component} from 'react';
import {Link} from "react-router-dom"

export class BirthdaySection extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className="birthday-section">
                <i className="fad fa-birthday-cake"></i>
                <p>
                    <span style={{marginRight: "4px"}}>
                         <Link
                             to="/quen-mat-khau"
                             title={"Đến tường nhà Vũ Quốc Việt"}
                         >
                            Vũ Quốc Việt
                        </Link>
                    </span>
                    <span style={{marginRight: "4px"}}>
                        và
                    </span>
                    <span style={{marginRight: "4px"}}>
                         <Link
                             to="/quen-mat-khau"
                             title={"Xem danh sách sinh nhật hôm nay"}
                         >
                            3 người khác
                        </Link>
                    </span>
                    <span>
                        sinh nhật hôm nay.

                    </span>

                </p>
            </div>
        );
    }
}
