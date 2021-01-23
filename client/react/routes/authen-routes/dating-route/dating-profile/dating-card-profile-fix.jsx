import React, { Component } from "react";
import { datingProfile } from "../../../../../common/states/common";
import classnames from "classnames";
import { FileDisplay } from "../../../../layout/authen-layout/create-message-widget/chat-box/message-utilities/file-display/file-display";
import { InputFileWrapper } from "./../../../../common/file-input/file-input";
import { v4 as uuidv4 } from "uuid";
import { ListingInfoInput } from "./../../../../common/listing-info-input/listing-info-input";
import { genders } from "./../../../../../const/genders";
import { ListingInfoSelect } from "./../../../../common/listing-info-select/listing-info-select";
import { addressApi } from "./../../../../../api/common/address-api";
import { educationLevels } from "./../../../../../const/educationLevels";
import { yourKides } from "../../../../../const/yourKides";
import { heights } from "./../../../../../const/height";
import { smokings } from "./../../../../../const/smokings";
import { drinkings } from "./../../../../../const/drinkings";
import { religions } from "./../../../../../const/religions";
import { targets } from "./../../../../../const/targets";
import { datingApi } from "./../../../../../api/common/dating";
import { customHistory } from "./../../../routes";
import { postApi } from "./../../../../../api/common/post-api";
export class DatingCardProfileFix extends Component {
  constructor(props) {
    super(props);
    const profile = datingProfile.getState();
    this.state = {
      name: profile.name,
      bio: profile.bio,
      location: {
        ward: profile.location.ward,
        district: profile.location.district,
        city: profile.location.city,
      },
      homeTown: {
        ward: profile.homeTown.ward,
        district: profile.homeTown.district,
        city: profile.homeTown.city,
      },
      gender: profile.gender,
      job: profile.job,
      secondarySchool: profile.secondarySchool,
      university: profile.university,
      height: profile.height,
      yourKids: profile.yourKids,
      educationLevel: profile.educationLevel,
      avatars: profile.avatars,
      target: profile.target,
      smoking: profile.smoking,
      drinking: profile.drinking,
      religion: profile.religion,
      pictureLimit: 10,
    };
    addressApi.getAddress({}).then((allCity) => this.setState({ allCity }));
  }

  addFiles = (files) => {
    let newFiles = Array.from(files).map((file) => {
      return { fileID: uuidv4(), file, type: "image" };
    });
    this.setState({ avatars: this.state.avatars.concat(newFiles) });
  };
  // removeFile = (fileID) => {
  //   this.setState({
  //     avatars: this.state.avatars.filter((file) => file.fileID !== fileID),
  //   });
  // };
  onRemove = (item) => {
    this.setState({
      avatars: this.state.avatars.filter((each) =>
        item.path ? item.path !== each.path : item.fileID !== each.fileID
      ),
    });
  };
  uploadSingleFile = (file) => {
    return file.path
      ? Promise.resolve(file)
      : postApi
          .preUploadMedia({ file: file.file }, "file")
          .then((fileData) => ({
            ...fileData,
          }));
  };

  getDefaultValue = (value, options) => {
    let result = options.find( obj => {
      return obj.value === value
    })
    return result;
  } 
  submit = () => {
    let {
      name,
      bio,
      location,
      homeTown,
      gender,
      job,
      secondarySchool,
      university,
      height,
      yourKids,
      educationLevel,
      avatars,
      target,
      smoking,
      drinking,
      religion,
    } = this.state;
    
    Promise.all(avatars.map((each) => this.uploadSingleFile(each))).then(
      (newFiles) => {
        let submittedData = {
          name,
          // birthday: new Date(
          //   `${birthday.month}/${birthday.day}/${birthday.year}`
          // ),
          homeTown: {
            ward: homeTown.ward,
            city: homeTown.city,
            district: homeTown.district,
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
          job,
          bio,
          target: target.value,
          drinking: drinking.value,
          religion: religion.value,
          smoking: smoking.value,
        };
        console.log(submittedData);
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          datingApi
            .updateProfile(
              {
                ...submittedData,
                location: {
                  ...location,
                  lat: latitude,
                  lng: longitude,
                },
                homeTown: { ...homeTown },
              },
              datingProfile.getState()._id
            )
            .then((e) => {
              datingProfile.setState(e);
              this.props.handleEdit();
            });
        });
      }
    );
  };
  render() {
    const {
      name,
      bio,
      location,
      homeTown,
      gender,
      job,
      secondarySchool,
      university,
      height,
      yourKids,
      educationLevel,
      avatars,
      target,
      smoking,
      drinking,
      religion,
      pictureLimit,
      allCity,
      allDistrict,
      allWard,
    } = this.state;

    const { handleEdit } = this.props;
    // console.log(homeTown);
    console.log(this.state);
    return (
      <div className="dating-card-profile-fix">
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
            <div className="images-display">
              <div className="images-container">
                {avatars.map((file) => {
                  return (
                    <FileDisplay
                      key={file.fileID || file.path}
                      file={file}
                      isImg={true}
                      onClose={() => this.onRemove(file)}
                    />
                  );
                })}
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
        Giới thiệu bản thân
        <div>
          <ListingInfoInput
            className="dr-input"
            label={"Tên"}
            value={name}
            onChange={(e) => {
              this.setState({ name: e.target.value });
            }}
          />
        </div>
        <ListingInfoInput
          className="dr-input"
          label={"Mô tả"}
          textArea={true}
          value={bio}
          onChange={(e) => {
            this.setState({ bio: e.target.value });
          }}
        />
        <div>
          <ListingInfoSelect
            className="dr-input"
            label={"Giới tính"}
            value={gender.id ? gender : this.getDefaultValue(gender, genders)}
            options={genders}
            displayAs={(item) => item.label}
            onChange={(item) => {
              this.setState({ gender: item });
            }}
          />
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
              value={yourKids.id ? yourKids : this.getDefaultValue(yourKids, yourKides)}
              options={yourKides}
              displayAs={(item) => item.label}
              onChange={(item) => {
                this.setState({ yourKids: item });
              }}
            />
          </div>
        </div>
        <div>
          <ListingInfoSelect
            className="dr-input"
            label={"Hút thuốc"}
            value={smoking.id ? smoking : this.getDefaultValue(smoking, smokings)}
            options={smokings}
            displayAs={(item) => item.label}
            onChange={(item) => {
              this.setState({ smoking: item });
            }}
          />
        </div>
        <div>
          <ListingInfoSelect
            className="dr-input"
            label={"Uống rượu"}
            value={drinking.id ? drinking : this.getDefaultValue(drinking, drinkings)}
            options={drinkings}
            displayAs={(item) => item.label}
            onChange={(item) => {
              this.setState({ drinking: item });
            }}
          />
        </div>
        <div>
          <ListingInfoSelect
            className="dr-input"
            label={"Quan điểm tôn giáo"}
            value={religion.id ? religion : this.getDefaultValue(religion, religions)}
            options={religions}
            displayAs={(item) => item.label}
            onChange={(item) => {
              this.setState({ religion: item });
            }}
          />
        </div>
        <div>
          <ListingInfoInput
            className="dr-input"
            label={"Công việc"}
            value={job}
            onChange={(e) => {
              this.setState({ job: e.target.value });
            }}
          />
        </div>
        <div>
          <ListingInfoInput
            className="dr-input"
            label={"Trường trung học"}
            value={secondarySchool}
            onChange={(e) => {
              this.setState({ secondarySchool: e.target.value });
            }}
          />
        </div>
        <div>
          <ListingInfoInput
            className="dr-input"
            label={"Trường đại học/cao đẳng"}
            value={university}
            onChange={(e) => {
              this.setState({ university: e.target.value });
            }}
          />
        </div>
        <div>
          <ListingInfoSelect
            className="dr-input"
            label={"Trình độ học vấn của bạn"}
            value={educationLevel.id ? educationLevel : this.getDefaultValue(educationLevel, educationLevels)}
            options={educationLevels}
            displayAs={(item) => item.label}
            onChange={(item) => {
              this.setState({ educationLevel: item });
            }}
          />
        </div>
        <div>
          <ListingInfoSelect
            className="dr-input"
            label={"Đang tìm kiếm"}
            value={target.id ? target : this.getDefaultValue(target, targets)}
            options={targets}
            displayAs={(item) => item.label}
            onChange={(item) => {
              this.setState({ target: item });
            }}
          />
        </div>
        <div className="dcpf-button" onClick={this.submit}>
          Lưu
        </div>
      </div>
    );
  }
}
