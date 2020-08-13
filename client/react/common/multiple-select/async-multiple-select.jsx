import React, {Component} from 'react';
import classnames from "classnames"
import {ClickOutside} from "../click-outside/click-outside";
import ContentEditable from 'react-contenteditable'
import {ThemeContext} from "../../context/theme-context";
import {LoadingInline} from "../loading-inline/loading-inline";
import debounce from "lodash/debounce"

export class AsyncMultipleSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            isFocus: props.focus === true,
            loading: props.focus === true
        };
        this.input = React.createRef();

    }

    handleDeleteItem = item => {
        let {onChange, values, deleteFilterFunc} = this.props;
        onChange(values.filter(each => deleteFilterFunc(each, item)));
    };

    componentDidMount() {
        if(this.props.fetchOnMount){
            this.callApi(this.state.keyword);
        }
        if(this.props.focus){
            this.input.current.focus();
        }
    }

    handleAddItem = item => {

        let {onChange, values, addCondition, onSelectItem} = this.props;
        if(onSelectItem) onSelectItem(item);
        this.input.current.focus();
        if(addCondition(item)){
            this.setState({keyword: ""})
            return onChange(values.concat(item))
        }



    };

    callApi = debounce((value) => {
        this.setState({loading: true});
        this.props.api({filter: {keyword: value}})
            .then(() => (
                this.setState({loading: false})
            ))
    }, 700);

    render() {
        let {keyword, isFocus, loading} = this.state;

        let {
            className ,
            displayTagAs = (each, index) => "Item " + (index + 1),
            displayAs = () => "displayAs function is not defined yet!",
            values,
            list,
            listKey = (each, index) => index,
            tagKey = (each, index) => index,
            emptyNotify = () => "Không có kết quả tương ứng",
            isPicked = (each, index) => false,
            showSummary = true,
        } = this.props;


        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <ClickOutside
                        onClickOut={() => {
                            this.state.isFocus && this.setState({isFocus: false})
                        }}
                    >
                        <div className={classnames("multiple-select", {darkMode}, className)}
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
                                        let value =  e.target.value;
                                        this.setState({keyword: value});
                                        this.callApi(value);
                                    }}
                                    onFocus={() => this.setState({isFocus: true})}
                                />
                            </div>
                            {isFocus && (
                                <div className="search-result">
                                    {showSummary && (
                                        <div className="result-summary">
                                            <span className="value">{list.length}</span><span>Kết quả</span>
                                        </div>
                                    )}
                                    <div className="results">
                                        {loading ? (
                                            <LoadingInline/>
                                        ) : list.length ? list.map((each, index) => (
                                            <div className={classnames("result-item", {picked: isPicked(each, index)})}
                                                 key={listKey(each, index)}
                                                 onClick={(e) => {
                                                     e.stopPropagation();
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

                                </div>
                            )}
                        </div>
                    </ClickOutside>
                )}
            </ThemeContext.Consumer>

        );
    }
}
