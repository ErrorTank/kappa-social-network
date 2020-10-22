import React, {Component} from 'react';
import {favoritesPickerModal} from "../../../../../common/modal/favorites-picker-modal/favorites-picker-modal";
import {Favorite} from "../../../../../common/favorite/favorite";
import {allFavorites} from "../../../../../common/favorite/favorites";

export class FavoritesPanel extends Component {

    editFavorites = () => {
        favoritesPickerModal.open({
            favorites: this.props.list
        }).then(() => this.props.onSaveList())
    }

    render() {
        let {list, onSaveList, isOwner} = this.props;
        return (
            <div className="about-panel favorites-panel">
                <div className={"ap-header"}>
                    <div className="ap-label">
                        <i className="fad fa-star"></i> Sở thích
                    </div>
                    {isOwner && (
                        <div className="ap-create-btn" onClick={this.editFavorites}>
                            Thêm/sửa sở thích
                        </div>
                    )}

                </div>
                <div className="ap-body">
                    <div className="ap-fields">
                        {allFavorites.filter(each => list.find(f => f === each.label)).map(each => (
                            <Favorite
                                className={"mb-3 mr-3"}
                                key={each.label}
                                readOnly={true}
                                favorite={each}
                            />
                        ))}
                    </div>

                </div>
            </div>
        );
    }
}

