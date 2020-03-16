import React, {Component} from 'react';
import {accountTypes} from "../../../../../const/account-types";
import {userApi} from "../../../../../api/common/user-api";
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";
import {customHistory} from "../../../routes";
import {Select} from "../../../../common/select/select";
import {CommonDataTable} from "../../../../common/common-data-table/common-data-table";
import {PageTitle} from "../../../../common/page-title/page-title";
import {SearchInput} from "../../../../common/search-input/search-input";

class AccountListRoute extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            list: [],
            keyword: "",
            accountType: accountTypes[0]
        };
    }

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => i + 1,

        }, {
            label: "Mã định danh",
            cellDisplay: (s) => s.identityID,

        }, {
            label: "Họ tên",
            cellDisplay: (s) => s.name,

        },{
            label: "Loại tài khoản",
            cellDisplay: (s) => {
                return accountTypes.find(each => each.value === s.role).label;
            }

        }
    ];

    render() {
        const api = (config) => userApi.getAccounts(config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
                total: null,
            };
        });
        let {loading,
            keyword,
            accountType
        } = this.state;
        return (
            <PageTitle
                title={"Quản lý tài khoản"}
            >
                <AuthenLayoutTitle
                    title={"Quản lý tài khoản"}
                >
                    <div className="registration-events manage-list-route">
                        <div className="common-route-wrapper">

                            <div className="route-actions">
                                <button className="btn btn-next icon-btn"
                                        onClick={() => customHistory.push("/manage/account/new")}
                                >
                                    <i className="fal fa-plus"></i>


                                    Tạo tài khoản
                                </button>
                            </div>
                            <div className="schedule-items">
                                {!loading && (
                                    <>
                                        <div className="table-actions">
                                            <div className="spec-select search-schedules">
                                                <SearchInput
                                                    placeholder={`Tìm theo mã định danh, email, họ tên, số điện thoại`}
                                                    onSearch={(keyword) => this.setState({keyword})}
                                                    value={keyword}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Loại tài khoản</span>
                                                <Select
                                                    options={accountTypes}
                                                    value={accountType}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        let value = e.target.value === "" ? "" : e.target.value;
                                                        this.setState({accountType: accountTypes.find(sp => sp.value === value)})
                                                    }}
                                                />

                                            </div>

                                        </div>
                                        <CommonDataTable
                                            className={"result-table"}
                                            api={api}
                                            filter={{
                                                keyword,
                                                accountType
                                            }}
                                            rowLinkTo={(e, row) => customHistory.push(`/manage/account/${row._id}/edit`)}
                                            columns={this.columns}
                                            rowTrackBy={(row, i) => row._id}
                                            emptyNotify={"Không có tài khoản nào"}
                                        />
                                    </>
                                )}


                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}

export default AccountListRoute;