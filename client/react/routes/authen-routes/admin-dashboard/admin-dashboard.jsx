import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {appConfigCache} from "../../../../common/cache/api-cache/common-cache";
import {mergeYear} from "../../../../common/utils/common";
import {registrationEventApi} from "../../../../api/common/registration-event";
import {Pie} from 'react-chartjs-2';
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {studentListByCreditModal} from "../../../common/modal/student-list-by-credit-modal/student-list-by-credit-modal";

export default class AdminDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            overview: {}
        };
        let {currentYear, latestSchoolYear, currentSemester} = appConfigCache.syncGet();
        registrationEventApi.getRegistrationEventFullOverview({
            semester: currentSemester,
            year: currentYear
        }).then(overview => this.setState({overview, loading: false}))
    };

    pieOptions = {
        maintainAspectRatio: false,
        responsive: false,
        legend: {
            position: 'right',
            labels: {
                boxWidth: 20
            }
        },
        tooltips: {
            callbacks: {
                title: function (tooltipItem, data) {
                    return data['labels'][tooltipItem[0]['index']];
                },
                label: function (tooltipItem, data) {
                    return data['datasets'][0]['data'][tooltipItem['index']] + " sinh viên";
                },
            },
            backgroundColor: '#404e67',
            titleFontSize: 14,
            bodyFontSize: 14,
            displayColors: false,
            width: "auto"
        }
    };

    filterTypes = {
        '>=15': 0,
        ">=12": 1,
        ">=10": 2,
        "<10": 3
    };

    handleClickPieChart = (element) => {
        console.log(element[0]._model.label)
        studentListByCreditModal.open({
            creditFilter: this.filterTypes[element[0]._model.label.replace(" Tín", "")],
            label: element[0]._model.label.replace(" Tín", "")
        })
    };

    render() {
        let {loading, overview} = this.state;
        let {registerQuantity} = overview;
        let {currentYear, latestSchoolYear, currentSemester} = appConfigCache.syncGet();
        let data = {
            registerQuantity: {
                labels: Object.keys(this.filterTypes).map(each => `${each} Tín`),
                datasets: [
                    {
                        data: registerQuantity ?
                            [registerQuantity["gte-15"].length, registerQuantity["gte-12-and-lt-15"].length, registerQuantity["gte-10-and-lt-12"].length, registerQuantity["lt-10"].length]
                            : [],
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56'
                        ],
                        hoverBackgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56'
                        ]
                    }
                ]
            }
        };
        return (
            <PageTitle
                title={"Trang chủ quản lý"}
            >
                <AuthenLayoutTitle
                    title={"Trang chủ quản lý"}
                >
                    <div className="admin-dashboard-route">
                        <div className="white-box">
                            <div className="white-box-header">
                                <div className="header-title">
                                    Tổng Quan
                                </div>
                            </div>
                            <div className="white-box-body">
                                <div className="overview-panel">
                                    <div className="small-panel">
                                        <div className="label">
                                            Kì Học Hiện Tại
                                        </div>
                                        <div className="value">
                                            {currentSemester + 1}
                                        </div>
                                    </div>
                                    <div className="small-panel">
                                        <div className="label">
                                            Năm Học
                                        </div>
                                        <div className="value">
                                            {mergeYear(currentYear)}
                                        </div>
                                    </div>
                                    <div className="small-panel">
                                        <div className="label">
                                            Niên Khóa Mới Nhất
                                        </div>
                                        <div className="value">
                                            {latestSchoolYear}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="white-box register-quantity">
                            <div className="white-box-header">
                                <div className="header-title">
                                    Thống Kê Sinh Viên Theo Tín Chỉ Đăng Ký
                                </div>
                            </div>
                            <div className="white-box-body">
                                {loading ? (
                                    <LoadingInline/>
                                ) : (
                                    <Pie data={data.registerQuantity}
                                         height={200}
                                         width={400}
                                         options={this.pieOptions}
                                         onElementsClick={this.handleClickPieChart}
                                    />
                                )}

                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}