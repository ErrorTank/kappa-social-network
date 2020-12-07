import React, { Component } from "react";
import { datingProfile } from "../../../../../common/states/common";
import { Avatar } from "./../../../../common/avatar/avatar";
import { customHistory } from "./../../../routes";
import { distanceTo } from "geolocation-utils";
import { ListingInfoSelect } from "./../../../../common/listing-info-select/listing-info-select";
import { distances } from "./../../../../../const/distance";
import { filterGenders } from "./../../../../../const/filterGender";
import { filterAges } from "./../../../../../const/filterAge";
import { heights } from "./../../../../../const/height";
import { filterEducationLevels } from "./../../../../../const/filterEducationLevels";
import { filterTheirKides } from "./../../../../../const/filterTheirKids";
import { filterReligions } from "../../../../../const/filterReligions";
import { religions } from "../../../../../const/religions";

export class DatingSetting extends Component {
  constructor(props) {
    super(props);
    const profile = datingProfile.getState();
    this.state = {
      distance: profile.filterSetting.distance,
      gender: profile.filterSetting.gender,
      ageRange: {
        fromNumber: profile.filterSetting.ageRange.fromNumber,
        toNumber: profile.filterSetting.ageRange.toNumber,
      },
      heightRange: {
        fromNumber: profile.filterSetting.heightRange.fromNumber,
        toNumber: profile.filterSetting.heightRange.toNumber,
      },
      educationLevel: profile.filterSetting.educationLevel,
      theirKids: profile.filterSetting.theirKids,
      religion: profile.filterSetting.religion,
    };
  }
  submit = () => {
    let {
      distance,
      gender,
      ageRange,
      heightRange,
      educationLevel,
      theirKids,
      religion,
    } = this.state;
    let submittedData = {
      distance,
      gender: gender.value,
      ageRange: {
        fromNumber: ageRange.fromNumber,
        toNumber: ageRange.toNumber,
      },
      heightRange: {
        fromNumber: heightRange.fromNumber,
        toNumber: heightRange.toNumber,
      },
      educationLevel: educationLevel.value,
      theirKids: theirKids.value,
      religion: religion.value,
    };
  };

  render() {
    let {
      distance,
      gender,
      ageRange,
      heightRange,
      educationLevel,
      theirKids,
      religion,
    } = this.state;
    return (
      <div className="dating-setting">
        <div className="dating-header">
          <i
            className="far fa-chevron-left"
            onClick={() => customHistory.push("/dating")}
          ></i>
          <div className="header-avatar">
            <Avatar
              user={{ avatar: datingProfile.getState().avatars[0].path }}
            />
          </div>
          <h2>Thông tin của tôi</h2>
        </div>
        <span className="ds-text"> Cài đặt tìm kiếm</span>
        <div className="wrap">
          <div className="title">
            <div className="dash"></div>
            <div className="text-title">Thông tin cơ bản</div>
            <div className="dash"></div>
          </div>
          <div className="row-wrapper">
            <ListingInfoSelect
              className="dr-input"
              label={"Khoảng cách "}
              value={distance}
              options={distances}
              displayAs={(item) => item + " km"}
              onChange={(item) => {
                this.setState({ distance: item });
              }}
            />
            <ListingInfoSelect
              className="dr-input"
              label={"Giới tính"}
              value={gender}
              options={filterGenders}
              displayAs={(item) => item.label}
              onChange={(item) => {
                this.setState({ gender: item });
              }}
            />

            <div>
              <ListingInfoSelect
                className="dr-input"
                label={"Trình độ học vấn"}
                value={educationLevel}
                options={filterEducationLevels}
                displayAs={(item) => item.label}
                onChange={(item) => {
                  this.setState({ educationLevel: item });
                }}
              />
              <ListingInfoSelect
                className="dr-input"
                label={"Con cái"}
                value={theirKids}
                options={filterTheirKides}
                displayAs={(item) => item.label}
                onChange={(item) => {
                  this.setState({ theirKids: item });
                }}
              />
              <ListingInfoSelect
                className="dr-input"
                label={"Quan điểm tôn giáo"}
                value={religion}
                options={filterReligions}
                displayAs={(item) => item.label}
                onChange={(item) => {
                  this.setState({ religion: item });
                }}
              />
            </div>
          </div>
        </div>
        <div className="wrap">
          <div className="title"> Độ tuổi</div>
          <div className="row-wrapper">
            <ListingInfoSelect
              className="dr-input"
              label={"Từ"}
              value={ageRange.fromNumber}
              options={filterAges}
              displayAs={(item) => item + " tuổi"}
              onChange={(item) => {
                this.setState({
                  ageRange: {
                    ...ageRange,
                    fromNumber: item,
                  },
                });
              }}
            />
            <ListingInfoSelect
              className="dr-input"
              label={"Đến"}
              value={ageRange.toNumber}
              options={filterAges}
              displayAs={(item) => item + " tuổi"}
              onChange={(item) => {
                this.setState({
                  ageRange: {
                    ...ageRange,
                    toNumber: item,
                  },
                });
              }}
            />
          </div>
        </div>
        <div className="wrap">
          <div className="title"> Chiều cao</div>
          <div className="row-wrapper">
            <ListingInfoSelect
              className="dr-input"
              label={"Từ"}
              value={heightRange.fromNumber}
              options={heights}
              displayAs={(item) => item + " cm"}
              onChange={(item) => {
                this.setState({
                  heightRange: {
                    fromNumber: item,
                    ...heightRange,
                  },
                });
              }}
            />
            <ListingInfoSelect
              className="dr-input"
              label={"Đến"}
              value={heightRange.toNumber}
              options={heights}
              displayAs={(item) => item + " cm"}
              onChange={(item) => {
                this.setState({
                  heightRange: {
                    ...heightRange,
                    toNumber: item,
                  },
                });
              }}
            />
          </div>
        </div>
        <div className="dcpf-button" onClick={this.submit}>
          Lưu
        </div>
      </div>
    );
  }
}
