import React, {Component} from 'react';
import {LoadingInline} from "../loading-inline/loading-inline";
import {Emoji} from "emoji-mart";
import {REACTION_EMOJI_MAP} from "../reactions-widget/reactions-widget";


export class ReactionTooltip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            fetching: true,
            left: 0
        }
        props.api().then(({list, left}) => this.setState({list, left, fetching: false}))

    }


    render() {
        let {list, fetching, left} = this.state;
        let {type} = this.props;
        return (
            <div className="reaction-tooltip">

                <div className="reaction-type">
                    <Emoji
                        set={'facebook'}
                        emoji={REACTION_EMOJI_MAP[type]}
                        size={18}
                    />
                </div>

                {fetching && (
                    <div className="loading-wrapper">
                        <LoadingInline/>
                    </div>
                )}

                <div>
                    {list.map(each => (
                        <div className={"reaction-user"} key={each._id}>
                            {each.basic_info.username}
                        </div>
                    ))}
                    {left > 0 && (
                        <div>
                            và {left} người khác...
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

