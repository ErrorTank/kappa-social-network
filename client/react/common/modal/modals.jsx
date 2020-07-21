import React, {Fragment} from "react";
import {Modal} from "./modal";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import remove from "lodash/remove";
import classnames from "classnames"
import {v4 as uuidv4} from 'uuid';

export const appModal = {
    alert({text, title, btnText = "OK", style, className}) {
        const modal = modals.openModal({
            content: (
                <div className={classnames("alert-modal common-modal", style + "-modal", className)}>
                    <div className="modal-header">
                        <div className="modal-title">
                            {title}
                        </div>
                        <i className="fas fa-times close-modal"
                           onClick={() => modal.close()}
                        />
                    </div>
                    <div className="modal-body">
                        <div>{text}</div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn modal-btn btn-cancel" onClick={() => modal.close()}>
                            {btnText}
                        </button>
                    </div>
                </div>
            )
        });
        return modal.result;
    },
    confirm({text, title, btnText = "Confirm", cancelText = "Cancel", className}) {
        const modal = modals.openModal({
            content: (
                <div className={classnames("confirm-modal common-modal", className)}>
                    <div className="modal-header">
                        <div className="modal-title">
                            {title}
                        </div>
                        <i className="fas fa-times close-modal"
                           onClick={() => modal.close(false)}
                        />
                    </div>
                    <div className="modal-body">
                        {text}
                    </div>
                    <div className="modal-footer">
                        <button className="btn modal-btn btn-cancel  ml-3"
                                onClick={() => modal.close(false)}
                        >
                            {cancelText}
                        </button>
                        <button className="btn modal-btn btn-common-primary ml-3"
                                onClick={() => modal.close(true)}
                        >
                            {btnText}
                        </button>

                    </div>
                </div>
            )
        });
        return modal.result;
    }
};

export class ModalsRegistry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalList: []
        };

        modals.openModal = (options) => {
            let modalOptions = {
                options,
                resolve: null
            };

            let {modalList} = this.state;
            this.setState({
                modalList: modalList.concat([modalOptions])
            });
            let result = new Promise((resolve) => {
                modalOptions.resolve = resolve;
            });
            return {
                dismiss: () => {
                    this.dismiss(modalOptions);
                },
                close: (result) => {
                    this.close(modalOptions, result);
                },
                result: result,
                toggleMinimize: () => {
                    return this.toggleMinimize(modalOptions)
                },
                closePromise: (result) => {

                    return this.closePromise(modalOptions, result);
                }
            };
        };
    }

    toggleMinimize(modal) {
        let modals = [...this.state.modalList];
        for (let m of modals) {
            if (m.options.key === modal.options.key) {
                m.options.minimize = !m.options.minimize;
            }
        }
        this.setState({modalList: modals});
        return () => {
            this.toggleMinimize(modal)
        };
    }

    dismiss(modal) {
        remove(this.state.modalList, modal);
        modal.resolve();
        this.forceUpdate();
    }

    close(modal, result) {
        remove(this.state.modalList, modal);
        modal.resolve(result);
        this.forceUpdate();
    }

    closePromise(modal, result) {
        remove(this.state.modalList, modal);
        modal.resolve(result);
        return new Promise(resolve => {
            console.log(this.state.modalList)
            this.forceUpdate(() => resolve());
        })

    }

    render() {
        const {modalList} = this.state;


        return (
            <TransitionGroup className="modals">
                {modalList.map((modal, i) => (
                    <CSSTransition
                        key={i}
                        timeout={300}
                        classNames={"slideIn"}
                    >
                        <Modal
                            isStack={modalList.length > 1}
                            className={modal.options.className}
                            content={modal.options.content}
                            minimize={modal.options.minimize}
                            disabledOverlayClose={modal.options.disabledOverlayClose}
                            onDismiss={() => this.dismiss(modal)}
                        />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        );
    }
}

export const modals = {};

