import React from "react";
import HomeIcon from '@material-ui/icons/Home';
import omit from "lodash/omit"
import reverse from "lodash/reverse"

const structures = {
    childrens: [
        {
            url: "/",
            label: (
                <span>
            <HomeIcon
                fontSize={"inherit"}
            />
            <span className="label">Trang chủ</span>
        </span>
            ),
            childrens: [

                {
                    url: "/tkb",
                    label: <span className="label">Thời khóa biểu</span>
                }, {
                    url: "/bang-diem",
                    label: <span className="label">Bảng điểm</span>
                }, {
                    url: "/ep-cung",
                    label: <span className="label">Ép cứng</span>
                },{
                    url: "/lop-bo-mon",
                    label: <span className="label">Lớp bộ môn</span>
                }, {
                    url: "/chuong-trinh-dao-tao",
                    label: <span className="label">CT đào tạo</span>
                }, {
                    url: "/tkb-toan-truong",
                    label: <span className="label">TKB toàn trường</span>
                },{
                    url: "/dang-ky-hoc",
                    label: <span className="label">Đăng ký học</span>
                },
            ]
        },
        {
            url: "/manage",
            label: (
                <span>
            <HomeIcon
                fontSize={"inherit"}
            />
            <span className="label">Trang chủ</span>
        </span>
            ),
            childrens: [
                {
                    url: "/manage/accounts",
                    label: <span className="label">Danh sách tài khoản</span>,
                    childrens: [
                        {
                            url: "/manage/account/new",
                            label: <span className="label">Tạo mới</span>,
                        }, {
                            regex: /\/manage\/account\/(\w+)\/edit/gi,
                            label: <span className="label">Cập nhật</span>,
                        }

                    ]
                },
                {
                    url: "/manage/import",
                    label: <span className="label">Import</span>
                },
                {
                    url: "/manage/registration-events",
                    label: <span className="label">Đợt đăng ký học</span>,
                    childrens: [
                        {
                            url: "/manage/registration-event/new",
                            label: <span className="label">Tạo mới</span>,
                        }, {
                            regex: /\/manage\/registration-event\/(\w+)\/edit/gi,
                            label: <span className="label">Cập nhật</span>,
                        }

                    ]
                },
            ]
        },
        {
            url: "/giao-vien",
            label: (
                <span>
            <HomeIcon
                fontSize={"inherit"}
            />
            <span className="label">Trang chủ</span>
        </span>
            ),
            childrens: [
                {
                    url: "/giao-vien/lich-giang-day",
                    label: <span className="label">Lịch giảng dạy</span>
                },
            ]
        }
    ]
};

let buildingRecursive = (structure, pathname, result) => {


    if (structure.regex && pathname.match(structure.regex)) {

        result = result.concat((omit(structure, ["childrens"])));

        return result;
    }

    if (pathname === structure.url) {
        result = result.concat(omit(structure, ["childrens"]));
        return result;
    }


    if (structure.childrens) {
        for (let str of structure.childrens) {

            result = buildingRecursive(str, pathname, result);
            // console.log(result)
            if (result.length) {
                if(structure.hasOwnProperty("label")){
                    result = result.concat(omit(structure, ["childrens"]));
                }

                return result;
            }
        }
    }

    return result;


};

export const createBreadcrumbBuilder = () => (pathname, result = []) => {
    let final = buildingRecursive(structures, pathname, result);

    return reverse(final);
};
