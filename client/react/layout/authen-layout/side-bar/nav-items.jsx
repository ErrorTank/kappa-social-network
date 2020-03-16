import React from "react";
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';
import CreateIcon from '@material-ui/icons/Create';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ClassIcon from '@material-ui/icons/Class';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import {userInfo} from "../../../../common/states/common";

export const navItems = [
    {
        label: "Trang chủ",
        url: "/",
        icon: <HomeIcon
            fontSize={"inherit"}
        />,
        roles: ["sv"]
    }, {
        label: "Trang chủ quản lý",
        url: "/manage",
        icon: <HomeIcon
            fontSize={"inherit"}
        />,
        roles: ["admin", "pdt"]
    }, {
        label: "Trang chủ giảng viên",
        url: "/giao-vien",
        icon: <HomeIcon
            fontSize={"inherit"}
        />,
        roles: ["gv"]
    }, {
        label: "Lịch giảng dạy",
        url: "/giao-vien/lich-giang-day",
        icon: <AccessTimeIcon
            fontSize={"inherit"}
        />,
        roles: ["gv"]
    }, {
        label: "Import dữ liệu",
        url: "/manage/import",
        icon: <PublishIcon fontSize={"inherit"}/>,
        roles: ["admin", "pdt"]
    }, {
        label: "Bảng điểm",
        url: "/bang-diem",
        icon: <AssignmentIcon
            fontSize={"inherit"}
        />,
        roles: ["sv"]
    }, {
        label: "Đăng ký học",
        url: "/dang-ky-hoc",
        icon: <DoneAllIcon
            fontSize={"inherit"}
        />,
        roles: ["sv"]
    }, {
        label: "Thời khóa biểu",
        url: "/tkb",
        icon: <AssignmentTurnedInIcon
            fontSize={"inherit"}
        />,
        roles: ["sv"]
    }, {
        label: "TKB toàn trường",
        url: "/tkb-toan-truong",
        icon: <FormatListNumberedRtlIcon
            fontSize={"inherit"}
        />,
        roles: ["bm", "sv", "gv", "admin", "pdt"],
        // disabled: true
    },{
        label: "Danh sách tài khoản",
        url: ["/manage/accounts", "/manage/account/new", /\/manage\/account\/(\w+)\/edit/gi],
        icon: <SupervisorAccountIcon
            fontSize={"inherit"}
        />,
        roles: ["admin"],
        defaultUrl: "/manage/accounts"
        // disabled: true
    }, {
        label: "Chương trình đào tạo",
        url: "/chuong-trinh-dao-tao",
        icon: <DeveloperBoardIcon
            fontSize={"inherit"}
        />,
        roles: ["sv", "gv"],
        // disabled: true
    }, {
        label: "Ép cứng",
        url: "/ep-cung",
        icon: <PeopleIcon
            fontSize={"inherit"}
        />,
        roles: ["gv", "pdt"],
        condition: () => {
            let info = userInfo.getState();
            return info ? info.role === "gv" ? info.info.canEditSchedule : true : false;
        }
    },{
        label: "Lớp bộ môn",
        url: "/lop-bo-mon",
        icon: <ClassIcon
            fontSize={"inherit"}
        />,
        roles: ["gv"],
        condition: () => {
            let info = userInfo.getState();
            return info.role === "gv" && info.info.canEditSchedule;
        }
    }, {
        label: "Quản lý đợt đăng ký",
        url: ["/manage/registration-events", "/manage/registration-event/new", /\/manage\/registration-event\/(\w+)\/edit/gi],
        icon: <CreateIcon
            fontSize={"inherit"}
        />,
        roles: ["admin", "pdt"],
        defaultUrl: "/manage/registration-events"
    }
];