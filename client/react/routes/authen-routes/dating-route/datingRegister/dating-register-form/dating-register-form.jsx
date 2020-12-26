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
import { educationLevels } from "./../../../../../../const/educationLevels";
import { InputFileWrapper } from "./../../../../../common/file-input/file-input";
import { v4 as uuidv4 } from "uuid";
import { ImageBox } from "./image-box/image-box";
import { postApi } from "./../../../../../../api/common/post-api";
import { yourKides } from "../../../../../../const/yourKides";
import classnames from "classnames";
import { FileDisplay } from "./../../../../../layout/authen-layout/create-message-widget/chat-box/message-utilities/file-display/file-display";
import { customHistory } from "./../../../../routes";

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
      yourKids: null,
      educationLevel: null,
      avatars: [],
      dob: null,

      pictureLimit: 10,
    };
    addressApi.getAddress({}).then((allCity) => this.setState({ allCity }));
  }

  uploadSingleFile = (file) => {
    return file.path
      ? Promise.resolve(file)
      : postApi
          .preUploadMedia({ file: file.file }, "file")
          .then((fileData) => ({
            ...fileData,
          }));
  };
  submit = () => {
    let {
      name,
      birthday,
      gender,
      homeTown,
      secondarySchool,
      university,
      height,
      location,
      yourKids,
      educationLevel,
      avatars,
      dob,
    } = this.state;
    // this.setState({ loading: true });
    Promise.all(avatars.map((each) => this.uploadSingleFile(each))).then(
      (newFiles) => {
        let submittedData = {
          name,
          birthday: new Date(
            `${birthday.month}/${birthday.day}/${birthday.year}`
          ),
          homeTown: {
            ward: homeTown.ward._id,
            city: homeTown.city._id,
            district: homeTown.district._id,
          },
          gender: gender.value,
          secondarySchool,
          university,
          height,
          location: {
            ward: location.ward._id,
            city: location.city._id,
            district: location.district._id,
          },
          yourKids: yourKids.value,
          educationLevel: educationLevel.value,
          avatars: newFiles,
        };

        console.log(submittedData);
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          datingApi
            .createProfile(
              {
                ...submittedData,
                location: {
                  ...location,
                  lat: latitude,
                  lng: longitude,
                },
              },
              userInfo.getState()._id
            )
            .then((e) => {
              this.props.onCreateProfile(e).then(() => {
                customHistory.push("/dating");
              });
            });
        });
      }
    );
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
  // addFiles = (files) => {
  //   let newFiles = Array.from(files).map((file) => {
  //     return { fileID: uuidv4(), file, type: "image" };
  //   });
  //   this.setState({ avatars: this.state.avatars.concat(newFiles) });
  // };
  //file( image in this case ) function
  addFiles = (files) => {
    let newFiles = Array.from(files).map((file) => {
      return { fileID: uuidv4(), file, type: "image" };
    });
    this.setState({ avatars: this.state.avatars.concat(newFiles) });
  };
  removeFile = (fileID) => {
    this.setState({
      avatars: this.state.avatars.filter((file) => file.fileID !== fileID),
    });
  };
  render() {
    const { avatars, pictureLimit } = this.state;
    console.log(this.state);
    let {
      name,
      dob,
      homeTown,
      allCity,
      allDistrict,
      allWard,
      height,
      yourKids,
      educationLevel,
      gender,
      location,
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
                value={yourKids}
                options={yourKides}
                displayAs={(item) => item.label}
                onChange={(item) => {
                  this.setState({ yourKids: item });
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
          {/* <div className="text-center">
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
          </div> */}
          {/* <InputFileWrapper
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
          </InputFileWrapper> */}
          <div className="picture-input-wrapper">
            <div className="picture-input" id="files">
              <div className="picture-input-header">
                <span
                  className={classnames("picture-limit", {
                    // error: files.length > pictureLimit,
                  })}
                >
                  Ảnh
                  <span className="dot"> · </span>
                  {avatars.length || 0} / {<span>{pictureLimit}</span>}
                </span>
                <span className="sub">
                  {" "}
                  - Bạn có thể thêm tối đa {pictureLimit} ảnh
                </span>
              </div>
              {!!avatars.length ? (
                <div
                  className="images-display"
                  // onMouseEnter={() => this.mouse("image")}
                  // onMouseLeave={() => this.mouseOut()}
                >
                  <div className="images-container">
                    {avatars.map((file) => (
                      <FileDisplay
                        key={file.fileID}
                        file={file}
                        onClose={() => this.removeFile(file.fileID)}
                      />
                    ))}
                    {!!avatars.length && (
                      <InputFileWrapper
                        multiple={true}
                        accept={"image/*,image/heif,image/heic"}
                        onUploaded={this.addFiles}
                        limitSize={10 * 1024 * 1024}
                      >
                        {({ onClick }) => (
                          <div className="add-file-wrapper">
                            {avatars.length < pictureLimit && (
                              <div className="add-file" onClick={onClick}>
                                <i className="fas fa-file-plus"></i>
                                <span>Thêm ảnh</span>
                              </div>
                            )}
                          </div>
                        )}
                      </InputFileWrapper>
                    )}
                  </div>
                </div>
              ) : (
                <InputFileWrapper
                  multiple={true}
                  accept={"image/*,image/heif,image/heic"}
                  onUploaded={this.addFiles}
                  limitSize={10 * 1024 * 1024}
                >
                  {({ onClick }) => (
                    <div
                      className={classnames("add-picture-section", {
                        // invalid: error.files,
                      })}
                      onClick={onClick}
                    >
                      <div className="add-picture-button">
                        <i className="fas fa-file-plus"></i>
                        <span>Thêm ảnh</span>
                      </div>
                    </div>
                  )}
                </InputFileWrapper>
              )}
            </div>
          </div>
          <div className="button" onClick={this.submit}>
            Tiếp tục
          </div>
        </div>
      </div>
    );
  }
}
