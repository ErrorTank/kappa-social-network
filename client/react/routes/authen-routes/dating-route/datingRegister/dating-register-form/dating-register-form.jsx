import React, { Component } from "react";
import { userApi } from "../../../../../../api/common/user-api";
import { userInfo } from "../../../../../../common/states/common";
import { datingApi } from "./../../../../../../api/common/dating";
import { genders } from "./../../../../../../const/genders";
import { ListingInfoInput } from "../../../../../common/listing-info-input/listing-info-input";
import { getAge } from "../../../../../../common/utils/date-utils";
import { addressApi } from "./../../../../../../api/common/address-api";
import { ListingInfoSelect } from "./../../../../../common/listing-info-select/listing-info-select";
import { heights } from "./../../../../../../const/height";
import { yourKids } from "./../../../../../../const/yourKids";
import { educationLevels } from "./../../../../../../const/educationLevels";
import { InputFileWrapper } from "./../../../../../common/file-input/file-input";
import { v4 as uuidv4 } from "uuid";
import { ImageBox } from "./image-box/image-box";
export class DatingRegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      birthday: { day: 1, month: 1, year: 1900 },
      gender: null,
      homeTown: {
        ward: null,
        district: null,
        city: null,
      },
      secondarySchool: "",
      university: "",
      height: null,
      location: {
        ward: null,
        district: null,
        city: null,
      },
      yourChildren: null,
      educationLevel: null,
      avatars: [],
      dob: null,
    };
    addressApi.getAddress({}).then((allCity) => this.setState({ allCity }));
  }
  addFiles = (files) => {
    let newFiles = Array.from(files).map((file) => {
      return { fileID: uuidv4(), file, type: "image" };
    });
    this.setState({ avatars: this.state.avatars.concat(newFiles) });
  };
  componentDidMount() {
    datingApi.getInheritUserInfor(userInfo.getState()._id).then((data) => {
      let date = new Date(data.basic_info.dob);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      this.setState({
        birthday: {
          day,
          month,
          year,
        },
        dob: data.basic_info.dob,
        name: data.basic_info.username,
        gender: genders.find((item) => item.value === data.basic_info.gender),
        avatars: data.basic_info.avatar
          ? [
              {
                path: data.basic_info.avatar,
                isAvatar: true,
              },
            ]
          : [],
      });
    });
  }
  onRemove = (item) => {
    this.setState({
      avatars: this.state.avatars.filter((each) =>
        item.path ? item.path !== each.path : item.fileID !== each.fileID
      ),
    });
  };
  render() {
    console.log(this.state);
    let {
      name,
      dob,
      homeTown,
      allCity,
      allDistrict,
      allWard,
      height,
      yourKid,
      educationLevel,
      gender,
    } = this.state;
    return (
      <div className="container">
        <div className="register-dating-form">
          <div className="wrap">
            <div className="title">
              <div className="dash"></div>
              <div className="text-title">Thông tin cơ bản</div>
              <div className="dash"></div>
            </div>
            <div className="row-wrapper">
              <ListingInfoInput
                className="dr-input"
                label={"Tên"}
                value={name}
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              />
              <div className="age-layout">
                <div className="label">Tuổi</div>{" "}
                <div className="value"> {getAge(dob)}</div>
              </div>
              <ListingInfoSelect
                className="dr-input"
                label={"Giới tính"}
                value={gender}
                options={genders}
                displayAs={(item) => item.label}
                onChange={(item) => {
                  this.setState({ gender: item });
                }}
              />
            </div>
          </div>
          <div className="wrap">
            <div className="title">
              <div className="dash"></div>
              <div className="text-title">Quê quán</div>
              <div className="dash"></div>
            </div>
            <div className="row-wrapper">
              <ListingInfoSelect
                className="dr-input"
                label={"Tỉnh/Thành phố"}
                value={homeTown.city}
                options={allCity}
                displayAs={(item) => item.name}
                onChange={(item) => {
                  this.setState({
                    homeTown: { ward: null, district: null, city: item },
                  });
                  addressApi
                    .getAddress({ cityCode: item.code })
                    .then((allDistrict) => this.setState({ allDistrict }));
                }}
              />
              <ListingInfoSelect
                className="dr-input"
                label={"Quận/Huyện"}
                value={homeTown.district}
                options={allDistrict}
                displayAs={(item) => item.name}
                disabled={!allDistrict}
                onChange={(item) => {
                  this.setState({
                    homeTown: { ...homeTown, district: item, ward: null },
                  });
                  addressApi
                    .getAddress({ districtCode: item.code })
                    .then((allWard) => this.setState({ allWard }));
                }}
              />

              <ListingInfoSelect
                className="dr-input"
                label={"Xã/Phường"}
                value={homeTown.ward}
                options={allWard}
                disabled={!allWard}
                displayAs={(item) => item.name}
                onChange={(item) => {
                  this.setState({ homeTown: { ...homeTown, ward: item } });
                }}
              />
            </div>
          </div>
          <div className="wrap">
            <div className="title">
              <div className="dash"></div>
              <div className="text-title">Vị trí hẹn hò</div>
              <div className="dash"></div>
            </div>
            <div className="row-wrapper">
              <ListingInfoSelect
                className="dr-input"
                label={"Tỉnh/Thành phố"}
                value={location.city}
                options={allCity}
                displayAs={(item) => item.name}
                onChange={(item) => {
                  this.setState({
                    location: { ward: null, district: null, city: item },
                  });
                  addressApi
                    .getAddress({ cityCode: item.code })
                    .then((allDistrict) => this.setState({ allDistrict }));
                }}
              />

              <ListingInfoSelect
                className="dr-input"
                label={"Quận/Huyện"}
                value={location.district}
                options={allDistrict}
                displayAs={(item) => item.name}
                disabled={!allDistrict}
                onChange={(item) => {
                  this.setState({
                    location: { ...location, district: item, ward: null },
                  });
                  addressApi
                    .getAddress({ districtCode: item.code })
                    .then((allWard) => this.setState({ allWard }));
                }}
              />
              <ListingInfoSelect
                className="dr-input"
                label={"Xã/Phường"}
                value={location.ward}
                options={allWard}
                disabled={!allWard}
                displayAs={(item) => item.name}
                onChange={(item) => {
                  this.setState({ location: { ...location, ward: item } });
                }}
              />
            </div>
          </div>
          <div className="wrap">
            <div className="title">
              <div className="dash"></div>
              <div className="text-title">Thông tin khác</div>
              <div className="dash"></div>
            </div>
            <div className="row-wrapper">
              <ListingInfoSelect
                className="dr-input"
                label={"Chiều cao"}
                value={height}
                options={heights}
                displayAs={(item) => item + " cm"}
                onChange={(item) => {
                  this.setState({ height: item });
                }}
              />
              <ListingInfoSelect
                className="dr-input"
                label={"Bạn có con chưa"}
                value={yourKid}
                options={yourKids}
                displayAs={(item) => item.label}
                onChange={(item) => {
                  this.setState({ yourKid: item });
                }}
              />
              <ListingInfoSelect
                className="dr-input"
                label={"Trình độ học vấn của bạn"}
                value={educationLevel}
                options={educationLevels}
                displayAs={(item) => item.label}
                onChange={(item) => {
                  this.setState({ educationLevel: item });
                }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="img-list">
              {this.state.avatars.map((item) => {
                return (
                  <ImageBox
                    key={item.path || item.fileID}
                    file={item}
                    onRemove={() => this.onRemove(item)}
                  />
                );
              })}
            </div>
          </div>
          <InputFileWrapper
            multiple={true}
            accept={"image/*,image/heif,image/heic"}
            onUploaded={this.addFiles}
            limitSize={10 * 1024 * 1024}
          >
            {({ onClick }) => (
              <div className="button" onClick={onClick}>
                Thêm ảnh
              </div>
            )}
          </InputFileWrapper>

          <div className="button">Tiếp tục</div>
        </div>
      </div>
    );
  }
}
