import React from "react";
import isEqual from "lodash/isEqual"
import {Pagination} from "./pagination/pagination";
import classnames from "classnames"
import isEmpty from "lodash/isEmpty";
import {customHistory} from "../../routes/routes";
import {LoadingInline} from "../loading-inline/loading-inline";
import {wait} from "../../../common/utils/common";
import io from "socket.io-client";
import {Tooltip} from "../tooltip/tooltip";

export class CommonDataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null,
            page: 0,
            loading: true,
            sort: null,
            total: null

        };

        if (props.realTimeConfig) {
            let {uri, createHandlers} = props.realTimeConfig;
            const utils = {
                setState: (state) => this.setState({...state})
            };
            this.socket = io(uri);
            let handlers = createHandlers(this.socket, utils);
            this.socket.on('connect', () => {
                console.log(this.socket.id);
                for (let h of handlers) {
                    this.socket.on(h.name, (data) => h.handler(data, {...this.state}))
                }

            });
        }

    };

    componentWillUnmount() {
        this.socket && this.socket.disconnect();
    }

    componentDidMount() {
        this.loadData({page: 0});
    }

    loadData = (changes = {}) => {
        let options = {
            page: changes.page === undefined ? this.state.page : changes.page,
            sort: changes.sort === undefined ? this.state.sort : changes.sort,
            filter: changes.filter === undefined ? this.props.filter : changes.filter,
        };

        this.setState({page: options.page, sort: options.sort, loading: true});

        this.props.api({
            filter: options.filter,
            sort: options.sort,
            skip: this.pageSize() * (options.page),
            take: this.pageSize()
        }).then((data) => {
            if (this.isDesiredLoad(options)) {
                this.setState({
                    loading: false,
                    list: data.list,
                    total: data.total,
                });
            }
        });
    };

    isDesiredLoad(options) {
        return options.page === this.state.page &&
            isEqual(options.sort, this.state.sort) &&
            isEqual(options.filter, this.props.filter)
            ;
    }


    toggleSort(sortKey) {
        if (this.state.sort === null || this.state.sort.key !== sortKey) {
            this.loadData({sort: {key: sortKey, value: "asc"}, page: 0});
        } else {
            if (this.state.sort.value === "asc") {
                this.loadData({sort: {key: sortKey, value: "desc"}, page: 0});
            } else {
                this.loadData({sort: null, page: 0});
            }
        }
    }


    componentWillReceiveProps(nextProps, nextContext) {
        const {filter, maxItem} = this.props;

        if (!isEqual(nextProps.filter, filter) || maxItem !== nextProps.maxItem) {
            this.loadData({page: 0, sort: null, filter: nextProps.filter})
        }
    }

    pageSize() {
        const {maxItem = 10} = this.props;
        return maxItem;
    }

    clickRow = (e, row) => {
        let {rowLinkTo, onClickRow} = this.props;
        if (rowLinkTo) {
            customHistory.push(rowLinkTo(e, row));
        } else if (onClickRow) {
            onClickRow(e, row);
        }
    };

    render() {
        let {columns, className, rowTrackBy = (row, i) => i, onClickRow, rowLinkTo, rowClassName, emptyNotify = "Empty table.", totalText, onMouseEnterRow, onMouseLeaveRow} = this.props;
        let {list, page, total, loading} = this.state;

        return (
            <div className="common-data-table">
                {list && totalText && (
                    <div className="summary">
                        {totalText(total)}
                    </div>
                )}
                {list != null && (
                    <table className={classnames("data-table", className)}>
                        <thead>
                        <tr>
                            {columns.map(this.renderHeaderCell)}
                        </tr>
                        </thead>
                        <tbody>
                        {!loading && (isEmpty(list) ? (
                            <tr>
                                <td className="no-data" colSpan={columns.length}>{emptyNotify}</td>
                            </tr>
                        ) : list.map((row, rIndex) => (
                            <tr
                                key={rowTrackBy(row, rIndex)}
                                onClick={(onClickRow == null && rowLinkTo == null) ? () => null : e => this.clickRow(e, row)}
                                className={classnames({clickable: onClickRow != null || rowLinkTo != null}, rowClassName)}
                                onMouseEnter={() => {
                                    if(onMouseEnterRow){
                                        onMouseEnterRow(row, rIndex);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if(onMouseLeaveRow){
                                        onMouseLeaveRow(row, rIndex);
                                    }
                                }}
                            >
                                {columns.map(({cellClass, checkBoxCell = false, cellDisplay, show = () => true, condition = () => true}, index) => {
                                return (show({data: list}) && condition()) ? (
                                    <td key={index}
                                        className={classnames(cellClass, {"checkbox-cell": checkBoxCell})}>

                                        {cellDisplay ? cellDisplay(row, rIndex) : null}
                                    </td>
                                ) : null;
                            })}


                            </tr>


                        )))}
                        </tbody>
                    </table>
                )}
                {loading && (
                    <LoadingInline className={"table-loading"}/>
                )}
                {this.props.maxItem && (
                    <div className="table-footer">
                        {(list && list.length) && (
                            <Pagination
                                value={page + 1}
                                totalPage={Math.ceil(total / this.pageSize())}
                                onChange={(newPage) => {
                                    this.loadData({page: newPage - 1})
                                }}
                            />
                        )

                        }

                    </div>
                )

                }


            </div>
        );
    }

    renderHeaderCell = (column, index) => {
        let {list} = this.state;
        let {label, sortable = false, sortKey, cellClass, customHeader = null, show = () => true, checkBoxCell = false, condition = () => true} = column;
        if (!show({list})) {
            return null;
        }
        let renderHeader = () => customHeader ? customHeader(list) : label;
        if (!sortable) {
            if (condition())
                return (
                    <th className={classnames(cellClass, {"checkbox-cell": checkBoxCell})} key={index}>
                        {renderHeader()}
                    </th>
                );
            return null;
        }

        if (!sortKey) {
            throw new Error(`Sortable Column "${label}" need sortFunc or sortKey property`);
        }

        return (
            <SortableHeaderCell
                key={index}
                label={label}
                className={cellClass}
                sort={this.state.sort && this.state.sort.key == sortKey && (this.state.sort.value)}
                onClick={() => this.toggleSort(sortKey)}
                header={renderHeader()}
            />
        )
    };
}

export function SortableHeaderCell(props) {
    return (
        <th onClick={props.onClick}
            className={classnames("sortable-header-cell", props.className)}
        >
              <span>
              {props.header}

                  {props.sort && (
                      <i className={`fas ${props.sort == "asc" ? 'fa-sort-down' : 'fa-sort-up'}`}/>
                  )}
              </span>
        </th>
    )
}