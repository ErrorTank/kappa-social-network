import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {parseQueryString} from "../../../../common/utils/string-utils";
import {customHistory} from "../../routes";

class GlobalSearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        let params = parseQueryString(props.location.search);
        if(!params.keyword){
            customHistory.push("/")
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.location.search !== prevProps.location.search){
        }
    }


    render() {
        return (
            <PageTitle
                title={"Kết quả tìm kiếm"}
            >
                <div className="global-search-result-route">
                </div>
            </PageTitle>
        );
    }
}

export default GlobalSearchResult;