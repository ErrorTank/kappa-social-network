import React, { Component } from 'react';
import { postApi } from '../../../api/common/post-api';
import { LoadingInline } from '../loading-inline/loading-inline';
import { PostBox } from '../post-box/post-box';

export class SharePostDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      post: null,
    };
    if (props.postID) {
      postApi
        .getPostByID(props.postID)
        .then((post) => this.setState({ post, loading: false }));
    }
  }

  render() {
    let { loading, post } = this.state;
    console.log(post);
    return (
      <div className='share-post-display'>
        {loading ? (
          <LoadingInline />
        ) : post ? (
          <PostBox
            isPreview={true}
            post={post}
            listing={post.listing && post.listing}
          />
        ) : (
          <div className='post-not-existed'>
            <div className='pne-title'>Không khả dụng</div>
            <div className='pne-content'>
              Nội dung chia sẻ đã bị xóa hoặc không tồn tại!
            </div>
          </div>
        )}
      </div>
    );
  }
}
