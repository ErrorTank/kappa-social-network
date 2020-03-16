import React from "react";
import {appConfigCache} from "../../../common/cache/api-cache/common-cache";
import {formatMoney} from "../../../common/utils/common";

export const SchoolCharge = ({schedule, schoolYear, label}) => {
    let {pricePerCredit} = appConfigCache.syncGet();
    let registeredSubjects = schedule ? Object.values(schedule.list.reduce((result, cur) => ({...result, [cur.class.subject._id]: cur.class.subject}), {})) : [];
    console.log(registeredSubjects)
    let price = pricePerCredit.find(each => each.schoolYear === schoolYear).price;
    let total = registeredSubjects.reduce((total, cur) => total + cur.coefficient * cur.credits * price, 0);
    return (
        <div className="school-charge">
            <span className="label">
                <i className="fad fa-coins"></i> {label}:
            </span>
            <span className="value">
                {formatMoney(total, 0)} VNĐ
            </span>
        </div>
    )
};