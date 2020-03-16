import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    };

    render() {

        return (
            <PageTitle
                title={"Trang chủ"}
            >
                <AuthenLayoutTitle
                    title={"Trang chủ"}
                >
                    <div className="dashboard-route">

                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}