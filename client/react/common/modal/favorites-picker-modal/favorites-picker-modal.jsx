import React, {Component} from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {modals} from "../modals";

import {CommonModalLayout} from "../common-modal-layout";
import {guestApi} from "../../../../api/common/guest-api";
import {userApi} from "../../../../api/common/user-api";
import {allFavorites} from "../../favorite/favorites";
import {Favorite} from "../../favorite/favorite";
import {userInfo} from "../../../../common/states/common";

export const favoritesPickerModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <FavoritesPickerModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
        });
        return modal.result;
    }
};

class FavoritesPickerModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            favorites: props.favorites || []
        };


    };


    save = () => {
        this.setState({loading: true})
        userApi.upsertFavorites(userInfo.getState()._id, {favorites: this.state.favorites})
            .then(() => this.props.onClose())
    }

    updateFavorites = (favorite, isPicked) => {
        if(isPicked){
            this.setState({favorites: this.state.favorites.filter(each => each !== favorite.label)})
        }else{
            this.setState({favorites: this.state.favorites.concat(favorite.label)})
        }
    }

    render() {
        let {loading, favorites} = this.state;
        let {onClose} = this.props;
        return (
            <CommonModalLayout
                className="favorites-picker-modal"
                onClose={() => {
                    if (!loading) {
                        onClose();
                    }
                }}
                title={"Sở thích"}
                actions={[
                    {
                        className: "btn-cancel",
                        onClick: () => {
                            if (!loading) {
                                onClose();
                            }
                        },
                        content: "Hủy"
                    }, {
                        className: "btn-common-primary",
                        onClick: () => {
                            if (!loading) {
                                this.save();
                            }
                        },
                        content: "Lưu sở thích",
                        loading
                    }
                ]}
            >
                <div className="favorites">
                    {allFavorites.map(each => (
                        <Favorite
                            className={"modal-favorite"}
                            active={favorites.find(f => f === each.label)}
                            onClick={(isPicked) => this.updateFavorites(each, isPicked)}
                            favorite={each}
                            key={each.label}
                        />
                    ))}
                </div>
            </CommonModalLayout>

        );
    }
}