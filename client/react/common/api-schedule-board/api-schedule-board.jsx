import React from "react";
import {ScheduleBoard} from "./schedule-board/schedule-board";
import {LoadingInline} from "../loading-inline/loading-inline";
import classnames from "classnames"
import isEqual from "lodash/isEqual";

export class ApiScheduleBoard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            list: null,
            loading: true
        };
    };

    componentDidMount() {
        this.loadData();
    }

    setLoading = () => {
        this.setState({loading: true});
    };

    resetData = () => this.setState({list: null})

    loadData = (changes = {}) => {
        let options = {
            filter: changes.filter === undefined ? this.props.filter : changes.filter,
        };

        this.setState({loading: true});

        return this.props.api({
            filter: options.filter,
        }).then((data) => {
            if (this.isDesiredLoad(options)) {
                this.setState({
                    loading: false,
                    list: data.list,
                });
            }
            return;
        });
    };

    isDesiredLoad(options) {
        return isEqual(options.filter, this.props.filter);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {filter} = this.props;

        if (!isEqual(nextProps.filter, filter)) {
            this.loadData({filter: nextProps.filter})
        }
    }

    render(){
        let {className, emptyNotify, api, filter , error, onClickItem, ...rest} = this.props;
        let {list, loading} = this.state;
        return(
            <div className={classnames("api-schedule-board", className)}>
                <ScheduleBoard
                    list={list}
                    onClickItem={(item) => onClickItem(item, {setLoading: this.setLoading})}
                    {...rest}
                />
                {loading && (
                    <LoadingInline className={"schedule-board-loading"}/>
                )}

                {(list && !list.length && emptyNotify) && (
                    <div className="empty-notify">
                        <span>{emptyNotify}</span>
                    </div>
                )}
                {error && (
                    <div className="empty-notify">
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }
}