import React from 'react';
import classnames from "classnames";
import {Button} from "../button/button";

export const CommonModalLayout = ({className, title, actions, onClose, children}) => {
    return (
        <div className={classnames("common-modal-layout common-modal", className)}>
            <div className="modal-header">
                <div className="modal-title">
                    {title}
                </div>
                <i className="fas fa-times close-modal"
                   onClick={() => onClose()}
                />
            </div>
            <div className="modal-body">
                {children}
            </div>
            {actions && (
                <div className="modal-footer">
                    {actions.map(({className, onClick, disabled = false, condition = () => true, content, loading = false}, i) => {
                        return condition() ? (
                            <Button className={classnames("btn modal-btn ml-3", className)}
                                    key={i}
                                    onClick={onClick}
                                    disabled={disabled}
                                    loading={loading}

                            >
                                {content}
                            </Button>
                        ) : null
                    })}

                </div>
            )}

        </div>
    );
};

