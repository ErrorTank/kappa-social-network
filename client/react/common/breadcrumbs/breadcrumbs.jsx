import React from "react";
import {customHistory} from "../../routes/routes";
import {createBreadcrumbBuilder} from "./breadcrumbs-structure";

export class Breadcrumbs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {location} = customHistory;
        const buildBreadcrumbsArray = createBreadcrumbBuilder();
        let arr = buildBreadcrumbsArray(location.pathname);

        return (
            <div className="breadcrumbs-container">
                {arr.length > 1 && (
                    <div className="breadcrumbs">
                        {arr.map((each, i) => (
                            <div className={"breadcrumbs__item"}
                                 key={each.url || each.regex.toString()}
                                 onClick={() => customHistory.push(each.url || window.location.href.replace(document.location.origin, ""))}
                            >
                                {each.label}
                            </div>
                        ))}
                    </div>
                )}
                {this.props.children}
            </div>
        );
    }
}