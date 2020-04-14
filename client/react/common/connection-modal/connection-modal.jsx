import {appModal} from "../modal/modals";
import React from "react";

export const openConnectionModal = () => appModal.alert({
    title: "Thông báo",
    text: (
        <div className="content-wrapper">
            <i className="fal fa-plug"></i>
            <div className="text">
                Đã có lỗi xảy ra. Vui lòng kiểm tra lại đường truyền và thử lại sau
            </div>
        </div>
    ),
    btnText: "Đóng",
    className: "connection-modal"
});