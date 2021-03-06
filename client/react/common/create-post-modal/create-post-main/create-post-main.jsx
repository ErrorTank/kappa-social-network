import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Avatar } from '../../avatar/avatar';
import { Select } from '../../select/select';
import { ClickOutside } from '../../click-outside/click-outside';
import { InputFileWrapper } from '../../file-input/file-input';
import { Tooltip } from '../../tooltip/tooltip';
import { PostPolicies } from '../create-post-modal';
import createEmojiMartPlugin from 'draft-js-emoji-mart-plugin';
import data from 'emoji-mart/data/facebook.json';

import { userInfo } from '../../../../common/states/common';
import { DropZone } from '../../file-input/dropzone';
import createMentionPlugin from 'draft-js-mention-plugin';
import { isImageFile } from '../../../../common/utils/file-upload-utils';
import classnames from 'classnames';
import Editor from 'draft-js-plugins-editor';

import { v4 as uuidv4 } from 'uuid';
import { FilesPreview } from '../files-preview/files-preview';
import { utilityApi } from '../../../../api/common/utilities-api';
import debounce from 'lodash/debounce';
import { SwitchBtn } from '../../switch/switch-btn';
import { userApi } from '../../../../api/common/user-api';
import { postApi } from '../../../../api/common/post-api';
import { SharePostDisplay } from '../../share-post-display/share-post-display';
import { numberToMoney } from '../../../../common/utils/listing-utils';
import { Button } from './../../button/button';

export const CreatePostDropZone = (props) => {
  const handleUploadFiles = (files) => {
    props.onAddFiles(files);
    return Promise.resolve();
  };
  return (
    <DropZone
      name='chat-box-file-upload'
      limitSize={10 * 1024 * 1024}
      className='background-dropzone'
      accept={'image/*,image/heif,image/heic,video/*'}
      multiple={true}
      dropPlaceHolder={
        <div className='background-dropzone-placeholder'>
          <span>Thả files vào đây</span>
        </div>
      }
      onChange={(files) => handleUploadFiles(files)}
    />
  );
};

export class CreatePostMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadSuggestion: true,
      showEmojiPicker: false,
      filteredSuggestions: [],
    };
    this.emojiPlugin = createEmojiMartPlugin({
      data,
      set: 'facebook',
      emojiSize: 16,
    });
    this.mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      supportWhitespace: true,
      // positionSuggestions: () => ({}),
      mentionPrefix: '@',
      mentions: [],
      mentionComponent: (mentionProps) => {
        return (
          <span
            className={classnames(
              'create-post-mention',
              mentionProps.className
            )}
          >
            {mentionProps.children}
          </span>
        );
      },
    });
  }

  onChange = (editorState) => {
    if (this.state.showEmojiPicker) {
      this.setState({ showEmojiPicker: false });
    }

    this.props.onChange({
      editorState,
    });
  };

  loadSuggestions = debounce(({ value }) => {
    return utilityApi.searchFriends(value).then((suggestions) =>
      this.setState({
        filteredSuggestions: this.filterSuggestions(suggestions),
      })
    );
  }, 500);

  onSearchChange = ({ value }) => {
    this.loadSuggestions({ value });
  };

  focus = () => {
    this.editor.focus();
  };

  tagFriends = () => {
    this.props.openTagFriendTab();
  };

  addFiles = (files) => {
    let newFiles = Array.from(files).map((file) => {
      return isImageFile(file.name)
        ? { fileID: uuidv4(), file, type: 'image' }
        : {
            fileID: uuidv4(),
            file,
            caption: '',
          };
    });

    this.props.onChange({ files: this.props.files.concat(newFiles) });
  };

  filterSuggestions = (data) => {
    return data.map((each) => ({ ...each, name: each.basic_info.username }));
  };

  render() {
    let { policy, tagged, isShare, postID, listing } = this.props;
    let { title, make, model, year, price, decription, homeType } = listing;
    let plugins = [this.emojiPlugin];
    plugins.push(this.mentionPlugin);

    let actions = [
      {
        icon: <i className='fas fa-user-tag'></i>,
        label: 'Tag bạn bè',
        onClick: this.tagFriends,
        className: 'tag',
      },
    ];
    if (!isShare) {
      actions.push({
        icon: <i className='far fa-photo-video'></i>,
        label: 'Ảnh/Video',
        className: 'media',
      });
    }
    const { Picker } = this.emojiPlugin;

    let user = userInfo.getState();
    const { MentionSuggestions } = this.mentionPlugin;
    return (
      <div className='create-post-main'>
        {!isShare && <CreatePostDropZone onAddFiles={this.addFiles} />}

        <div className='cpm-wrapper'>
          <div className='cpm-header'>
            <div className='avatar-wrapper'>
              <Avatar user={user} />
            </div>
            <div className='right-panel'>
              <div className='username'>
                <span>{user.basic_info.username}</span>
                {!!tagged.length && ' đang ở cùng '}
                {!!tagged.length &&
                  tagged.map((each, i) => (
                    <span key={each._id}>
                      {each.basic_info.username}
                      {i === tagged.length - 2 && ' và '}
                      {i < tagged.length - 2 && ', '}
                    </span>
                  ))}
              </div>
              <div className='action'>
                <Select
                  className={'policy-picker'}
                  options={PostPolicies}
                  value={policy}
                  onChange={(policy) => {
                    this.props.onChange({ policy });
                  }}
                  displayAs={(value) => (
                    <div className='post-policy'>
                      <span>{value.icon}</span>
                      <span>{value.label}</span>
                    </div>
                  )}
                  isSelected={(option) => option.value === policy.value}
                />
              </div>
            </div>
          </div>
          <div className='cpm-body'>
            {listing && (
              <div className='marketplace-post-info'>
                <div className='mp-main-info'>
                  <div className='mp-wrapper'>
                    <div className='mp-title'>
                      {title
                        ? title
                        : make
                        ? `${make} ${model} ${year}`
                        : homeType}
                    </div>
                    <div className='mp-price'>
                      {price && numberToMoney(price.toString())}
                    </div>
                  </div>
                  <Button
                    className={classnames('mp-send-button facebook-button')}
                    // onClick={e.click}
                  >
                    <i className='fas fa-info-circle'></i>
                    <span>Sản phẩm</span>
                  </Button>
                </div>

                {decription && (
                  <div className='mp-decription'>{decription}</div>
                )}
              </div>
            )}
            {!!this.props.files.length && (
              <FilesPreview
                files={this.props.files}
                removeAll={() => this.props.onChange({ files: [] })}
                toFilesTab={this.props.toFilesTab}
              />
            )}
            {isShare && <SharePostDisplay postID={postID} />}

            <div className='cpm-input-wrapper'>
              <ClickOutside
                onClickOut={() => this.setState({ showEmojiPicker: false })}
              >
                <div>
                  <div
                    ref={(cpmInput) => (this.cpmInput = cpmInput)}
                    className={classnames('cpm-input', {
                      collapsed: this.props.files.length,
                    })}
                    onClick={this.focus}
                  >
                    <div>
                      <Editor
                        editorState={this.props.editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                        ref={(element) => {
                          this.editor = element;
                        }}
                        placeholder={this.props.placeholder}
                      />
                      <MentionSuggestions
                        onSearchChange={this.onSearchChange}
                        suggestions={this.state.filteredSuggestions}
                        // popoverComponent={<MentionPopover top={ReactDOM.findDOMNode(this.cpmInput)?.offsetHeight || 0}/>}
                        entryComponent={MentionEntry}
                      />
                    </div>
                  </div>

                  <div
                    className={'emoji-select'}
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({
                        showEmojiPicker: !this.state.showEmojiPicker,
                      });
                    }}
                  >
                    <i className='fal fa-smile'></i>
                  </div>
                  {this.state.showEmojiPicker && (
                    <div className={'emoji-picker'}>
                      <Picker
                        perLine={7}
                        showPreview={false}
                        autoFocus={true}
                      />
                    </div>
                  )}
                </div>
              </ClickOutside>
            </div>
            <div className='actions-bar'>
              <div className='bar-title'>Thêm vào bài đăng</div>
              <div className='actions'>
                {actions.map((each) =>
                  each.className !== 'tag' ? (
                    <InputFileWrapper
                      multiple={true}
                      accept={
                        each.className === 'media'
                          ? 'image/*,image/heif,image/heic,video/*'
                          : '*'
                      }
                      onUploaded={this.addFiles}
                      key={each.label}
                      limitSize={10 * 1024 * 1024}
                    >
                      {({ onClick }) => (
                        <Tooltip
                          key={each.label}
                          position={'top'}
                          text={() => each.label}
                        >
                          <div
                            className={classnames('action', each.className)}
                            onClick={onClick}
                          >
                            {each.icon}
                          </div>
                        </Tooltip>
                      )}
                    </InputFileWrapper>
                  ) : (
                    <Tooltip
                      key={each.label}
                      position={'top'}
                      text={() => each.label}
                    >
                      <div
                        className={classnames('action', each.className)}
                        onClick={each.onClick}
                      >
                        {each.icon}
                      </div>
                    </Tooltip>
                  )
                )}
              </div>
            </div>
            <div className='post-config'>
              <div className='pc-label'>Tắt bình luận</div>
              <div className='pc-action'>
                <SwitchBtn
                  className={'pc-toggle'}
                  value={this.props.comment_disabled}
                  onToggle={(value) => {
                    this.props.onChange({ comment_disabled: value });
                  }}
                />
              </div>
            </div>
            <div className='post-config'>
              <div className='pc-label'>Tắt chia sẻ</div>
              <div className='pc-action'>
                <SwitchBtn
                  className={'pc-toggle'}
                  value={this.props.block_share}
                  onToggle={(value) => {
                    this.props.onChange({ block_share: value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// class MentionPopover extends React.Component {
//     render() {
//
//         return (
//             <div className={classnames("cpm-mention-popover")} id={this.props.id} role={"list-box"} style={{top: this.props.top + "px"}}>
//                 {this.props.children}
//             </div>
//         )
//     }
// }

const MentionEntry = (props) => {
  const {
    mention,
    theme,
    searchValue,
    isFocused,
    className,
    ...parentProps
  } = props;

  return (
    <div className={classnames('cpm-entry')} {...parentProps}>
      <div className='content-wrapper'>
        <Avatar user={mention} />
        <div className='user-info'>
          <div className='username'>{mention.basic_info.username}</div>
          {mention.nickname && (
            <div className='nickname'>{mention.nickname}</div>
          )}
        </div>
      </div>
    </div>
  );
};
