import React, {Component} from 'react';
import {LoadingInline} from "../../../../../common/loading-inline/loading-inline";
import {utilityApi} from "../../../../../../api/common/utilities-api";
import {parseHtmlEnteties} from "../../../../../../common/utils/string-utils";
import pick from "lodash/pick"

export class HyperLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
        utilityApi.getUrlMetadata(props.link)
            .then(data => {
                this.setState({data: {...pick(data, ["image", "title", "url", "source"]), title: parseHtmlEnteties(data.title)}});
                props.onLoaded();
            })


    }
    render() {
        return (
            <div className="hyperlink">
                {this.state.data ? (
                    <div className="info-wrapper">
                        {this.state.data.image && (
                            <div className="url-image">
                                <img src={this.state.data.image}/>
                            </div>
                        )}
                        <div className="url-main">
                            <div className="url-title">{this.state.data.title}</div>
                            <div className="url-source">{this.state.data.source}</div>
                        </div>
                    </div>
                ) : (
                    <LoadingInline/>
                )}
            </div>
        );
    }
}
