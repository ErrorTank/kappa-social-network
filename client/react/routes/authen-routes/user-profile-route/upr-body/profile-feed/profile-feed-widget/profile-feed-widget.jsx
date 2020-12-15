import React, { Component } from 'react';
import { PostCreationBox } from '../../../../feed-route/feed-widget/feed-widget';
import { InfiniteScrollWrapper } from '../../../../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper';
import { PageTitle } from '../../../../../../common/page-title/page-title';
import debounce from 'lodash/debounce';
import { postApi } from '../../../../../../../api/common/post-api';
import { LoadingInline } from '../../../../../../common/loading-inline/loading-inline';
import { PostBox } from '../../../../../../common/post-box/post-box';
import { userInfo } from '../../../../../../../common/states/common';

export class ProfileFeedWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true,
      needReloaded: false,
    };
    this.fetchPostsForFeed(props.user._id);
  }

  fetchPostsForFeed = (userID) => {
    return postApi
      .getPostsByUserID(userID, { skip: this.state.list.length, limit: 5 })
      .then((posts) => {
        this.setState({
          list: this.state.list.concat(posts),
          loading: false,
          needReloaded: posts.length < 5,
        });
      });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.user._id !== this.props.user._id) {
      this.setState({ list: [], loading: true, needReloaded: false }, () => {
        setTimeout(() => {
          this.fetchPostsForFeed(this.props.user._id);
        }, 500);
      });
    }
  }

  debounceLoad = debounce(() => {
    let { posts, needReloaded } = this.state;
    if (!needReloaded === !this.state.loading) {
      this.setState({ loading: true }, () => {
        this.fetchPostsForFeed(this.props.user._id);
      });
    }
  }, 500);

  addPost = (post) => {
    this.setState({ list: [post].concat(this.state.list) });
  };

  reload = () => {
    this.setState({ loading: true, list: [], needReloaded: false }, () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      this.fetchPostsForFeed();
    });
  };

  changePost = (postID, post, index) => {
    let newPosts = [...this.state.list];
    // console.log(newPosts)
    newPosts.splice(index, 1, post);
    this.setState({ list: newPosts });
  };

  deletePost = (post, i) => {
    let { list } = this.state;
    this.setState({
      list: list.filter((each) => each._id !== post._id),
    });
  };

  render() {
    let { list, loading, needReloaded } = this.state;
    // console.log(list);
    let user = userInfo.getState();
    return (
      <div className='profile-feed-widget'>
        <PostCreationBox
          belongedWall={
            user._id === this.props.user._id ? null : this.props.user._id
          }
          onCreatePost={this.addPost}
          placeholder={
            user._id === this.props.user._id
              ? `${user.basic_info.username} ơi! Bạn đang nghĩ gì thế?`
              : `Bạn có gì muốn nói với ${this.props.user.basic_info.username} à? Nói đi bạn eiii...`
          }
        />
        <InfiniteScrollWrapper
          useWindowRoot
          onScrollBottom={() => {
            this.debounceLoad();
          }}
        >
          {() => (
            <div className='post-list'>
              {list.map((each, i) => (
                <PostBox
                  key={each._id}
                  post={each}
                  isMyPost={user._id === each.belonged_person._id}
                  onChangePost={(post) => this.changePost(each._id, post, i)}
                  onDeletePost={() => this.deletePost(each, i)}
                  onSharePost={(p) => this.addPost(p)}
                  listing={each.listing}
                />
              ))}
              {loading && (
                <div className='loading-panel'>
                  <LoadingInline />
                </div>
              )}
              {needReloaded && (
                <div className='need-reloaded white-box'>
                  <p className='til'>Co vẻ như không còn bài đăng nào.</p>
                  <button
                    className='btn btn-common-primary btn-reloaded'
                    onClick={this.reload}
                  >
                    Tải lại
                  </button>
                </div>
              )}
            </div>
          )}
        </InfiniteScrollWrapper>
      </div>
    );
  }
}
