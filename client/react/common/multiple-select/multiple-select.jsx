import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from "classnames"
import {ClickOutside} from "../click-outside/click-outside";
import ContentEditable from 'react-contenteditable'

export class MultipleSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            isFocus: false
        }
        this.input = React.createRef();
    }

    handleDeleteItem = item => {
        let {onChange, values, deleteFilterFunc} = this.props;
        onChange(values.filter(each => deleteFilterFunc(each, item)));
    };


    handleAddItem = item => {
        let {onChange, values} = this.props;
        console.log(item)
        console.log(values)
        onChange(values.concat(item))
    };

    render() {
        let {keyword, isFocus} = this.state;

        let {displayTagAs = (each, index) => "Item " + (index + 1), displayAs = () => "displayAs function is not defined yet!", values, list, filterFunc, listKey = (each, index) => index, tagKey = (each, index) => index, emptyNotify = () => "Không có kết quả tương ứng", isPicked = (each, index) => false} = this.props;
        let filterList = filterFunc(list, keyword);
        console.log(keyword)
        return (
            <ClickOutside
                onClickOut={() => {
                    this.state.isFocus && this.setState({isFocus: false})
                }}
            >
                <div className="multiple-select"
                     onClick={() => {
                         this.input.current.focus();
                     }}
                >
                    <div className="tags-container">
                        {values.map((each, index) => (
                            <span className={classnames("tag")}
                                  key={tagKey(each, index)}
                            >
                                {displayTagAs(each, index)}
                                <i className="fal fa-times" onClick={(e) => {
                                    e.stopPropagation();
                                    this.handleDeleteItem(each, index);
                                }}></i>
                            </span>
                        ))}
                        <ContentEditable
                            className="rest-input"
                            contentEditable={true}
                            innerRef={this.input}
                            html={keyword}
                            onKeyDown={(e) => {
                                if (this.state.keyword === "" && e.keyCode === 8) {
                                    this.props.onChange(this.props.values.filter((each, i) => i !== this.props.values.length - 1));
                                }
                            }}
                            onChange={(e) => {
                                this.setState({keyword: e.target.value});
                            }}
                            onFocus={() => this.setState({isFocus: true})}
                        />
                    </div>
                    {isFocus && (
                        <div className="search-result">
                            <div className="result-summary">
                                <span className="value">{filterList.length}</span><span>Kết quả</span>
                            </div>
                            {filterList.length ? filterList.map((each, index) => (
                                <div className={classnames("result-item", {picked: isPicked(each, index)})}
                                     key={listKey(each, index)}
                                     onClick={(e) => {
                                         e.stopPropagation();
                                         console.log(!isPicked(each))
                                         if (!isPicked(each)) {
                                             this.handleAddItem(each, index);
                                         }

                                     }}
                                >
                                    {displayAs(each, index)}
                                </div>
                            )) : <div className="empty-notify">
                                {emptyNotify()}
                            </div>}
                        </div>
                    )}
                </div>
            </ClickOutside>

        );
    }
}
