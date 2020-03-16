import React from "react"

export const OverlayLoading = ({renderText = () => "Tải trang..."}) => (
    <div id="initial-loading">
        <div className="lds-css ng-scope">
            <div id="il-wrapper">
                <div className="loadingio-spinner-ripple-cqafjyzu1eh">
                    <div className="ldio-q99wu626rti">
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <p id="il-text">{renderText()}</p>
            </div>
        </div>
    </div>
);