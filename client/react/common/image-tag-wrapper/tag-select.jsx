import React, {Component} from 'react';
import {CommonInput} from "../common-input/common-input";
import debounce from "lodash/debounce"
import {Avatar} from "../avatar/avatar";
import classnames from "classnames"
import {LoadingInline} from "../loading-inline/loading-inline";

export class TagSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            list: [],
            loading: true
        }
        this.fetchData("");
    }

    fetchData = debounce(keyword => {
        this.setState({loading: true})
        this.props.api({keyword}).then(list => this.setState({list, loading: false}))
    }, 500)

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.keyword !== this.state.keyword){
            this.fetchData(this.state.keyword)
        }
    }

    render() {
        let {position, focusBoxLength, isTagged, onSelect} = this.props;
        let {keyword, list, loading} = this.state;
        return (
            <div className="tag-select" style={{
                top: position.y + focusBoxLength / 2 + 5 +"px",
                left: position.x
            }} onClick={e => e.stopPropagation()}>
                <div className="select-wrapper">
                    <div className="select-container">
                        <CommonInput
                            className={"tag-select-input"}
                            value={keyword}
                            autoFocus ={true}
                            placeholder={"Tìm kiếm bạn"}
                            type={"text"}
                            onChange={e => this.setState({keyword: e.target.value})}
                        />
                        <div className="results">
                            {!loading ? list.length ? list.map(each => (
                                <div className={classnames("item", {active: isTagged(each)})} key={each._id} onClick={(e) => {
                                    e.stopPropagation();
                                    !isTagged(each) && onSelect(each)
                                }}>
                                    <div className="avatar-wrapper">
                                        <Avatar
                                            user={each}
                                        />
                                    </div>
                                    <div className="username">{each.basic_info.username}</div>
                                </div>
                            )) : "Không tìm thấy" : (
                                <LoadingInline/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

