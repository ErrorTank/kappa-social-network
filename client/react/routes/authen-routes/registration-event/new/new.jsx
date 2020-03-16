import React from 'react';
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";
import {PageTitle} from "../../../../common/page-title/page-title";
import {RegistrationEventForm} from "../registration-event-form";
import {customHistory} from "../../../routes";
import omit from "lodash/omit"
import {registrationEventApi} from "../../../../../api/common/registration-event";
import {parseYear} from "../../../../../common/utils/common";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {StatisticPanel} from "../../../../common/statistic-panel/statistic-panel";
import isEqual from "lodash/isEqual"
import pick from "lodash/pick"

class RegistrationEventNewRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            loadOverview: true,
            config: {},
            overview: null
        };


    };

    handleFormChange = (formData) => {
        this.state.error && this.setState({error: ""});
        let data = pick(formData, ["studentGroup"]);
        if(!isEqual(this.state.config, data)){
            this.setState({loadOverview: true, config: data});
            registrationEventApi.getEventOverview(data).then(overview => this.setState({overview, loadOverview: false}))
        }
    };


    handleCreateRegistrationEvent = (form) => {
        this.setState({loading: true});
        let data = form.getData();
        let childEvents = [...data.childEvents];
        data.childEvents = childEvents.map(each => {
            if(!each.delay){
                each = omit(each, "delay");
            }else{
                each.delay = each.delay.toString();
            }
            each = omit(each, "id");
            return each;
        });

        registrationEventApi.create({...data,
            year: parseYear(data.year.value),
            semester: data.semester.value,
            studentGroup: data.studentGroup.value,
        }).then(newRegistrationEvent => {
           customHistory.push(`/manage/registration-event/${newRegistrationEvent._id}/edit`);
        }).catch(err => this.setState({loading: false, error: err.message}));
    };

    render() {

        return (
            <PageTitle
                title={"Tạo đợt đăng ký học"}
            >
                <AuthenLayoutTitle
                    title={"Tạo đợt đăng ký học"}
                >
                    <div className="registration-event-new-route">
                        <StatisticPanel
                            statistics={[
                                {
                                    label: "Sinh viên tham gia",
                                    value: this.state.overview ? this.state.overview.studentsCount : 0,
                                    icon: <i className="fad fa-users"></i>,
                                    style: "info"
                                },
                            ]}
                        />
                        <div className="common-route-wrapper">

                            <div className="route-body">

                                <RegistrationEventForm
                                    onFormChange={this.handleFormChange}
                                    serverError={this.state.error}
                                    renderActions={(form, childEventsError) => {
                                        const canCreate = !form.getInvalidPaths().length && !this.state.error && !this.state.loading && !childEventsError;
                                        return (
                                            <>
                                                <button className="btn btn-cancel"
                                                        onClick={() => customHistory.push("/manage/registration-events")}

                                                >
                                                    Trở về
                                                </button>
                                                <button className="btn btn-next"
                                                        onClick={() => this.handleCreateRegistrationEvent(form)}
                                                        disabled={!canCreate}
                                                >
                                                    Tạo mới
                                                    {this.state.loading && (
                                                        <LoadingInline/>
                                                    )}
                                                </button>
                                            </>
                                        )
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}

export default RegistrationEventNewRoute;