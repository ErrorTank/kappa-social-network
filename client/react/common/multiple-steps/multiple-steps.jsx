import React from "react";
import classnames from "classnames";
import {LoadingInline} from "../loading-inline/loading-inline";

export class MultipleSteps extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        let {btnConfig, curStepIndex, steps, onCancel} = this.props;
        let {nextText, cancelText, finishText, previousText} = btnConfig;
        let {onNext, canNext = () => false, onPrevious = () => null, render, title, hideNext = () => false, hideCancel = () => false, nextLoading = () => false} = steps[curStepIndex];
        return(
            <div className="multiple-steps">
                <div className="steps-nav">
                    <div className="steps-line"/>

                        {steps.map((each, i) => (
                            <div className={classnames("steps-line-item", {disabled: curStepIndex < i, active: curStepIndex === i})} key={i}
                                 onClick={() => each.onClickNav(i)}
                            >
                                <div className="wrapper">
                                    <div className="step-index">
                                        {curStepIndex > i ? (
                                            <span>&#10003;</span>
                                        ) : (
                                            <span>{i + 1}</span>
                                        )

                                        }

                                    </div>
                                    <div className="step-subtitle">
                                        {each.subtitle}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <div className="step-details">
                    {title && (
                        <h3 className="step-title">{title}</h3>
                    )}

                    {render()}
                    <div className="step-actions">
                        {!hideCancel() && (
                            <button className="btn btn-cancel"
                                    onClick={onCancel}
                            >
                                {cancelText}
                            </button>
                        )}

                        {curStepIndex > 0 && (
                            <button className="btn btn-back"
                                    onClick={onPrevious}
                            >
                                {previousText}
                            </button>
                        )}
                        {!hideNext() && (
                            <button className={classnames("btn btn-next", {disabled: !canNext()})}
                                    onClick={onNext}
                                    disabled={!canNext() || nextLoading()}
                            >
                                {curStepIndex === steps.length -1 ?  finishText : nextText}
                                {nextLoading() && (
                                    <LoadingInline
                                        className={"login-loading"}
                                    />
                                )}
                            </button>
                        )

                        }


                    </div>
                </div>

            </div>
        );
    }
}