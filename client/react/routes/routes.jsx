import React, { lazy, Suspense } from 'react';
import { Route, Router, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ModalsRegistry } from '../common/modal/modals';

export const customHistory = createBrowserHistory();
import { OverlayLoading } from '../common/overlay-loading';
import { delayLoad } from '../../common/utils/common';
import { CustomSwitch } from './route-types/custom-switch';
import { userInfo } from '../../common/states/common';
import { offlineApi } from '../../api/api';
import { FlexibleRoute } from './route-types/flexible-route';
import { authenCache } from '../../common/cache/authen-cache';
import { GuestRoute } from './route-types/guest-route/guest-route';
import { AuthenRoute } from './route-types/authen-route/authen-route';
import { WithRouterKappaLayout } from '../layout/kappa-layout';
import { topFloatNotifications } from '../common/float-top-notification/float-top-notification';
import { bottomNotification } from '../common/float-top-notification/bottom-notification';

let TopFloatNotificationRegistry = topFloatNotifications.Registry;
let BottomNotificationRegistry = bottomNotification.Registry;
import { ThemeContext, ThemeController } from '../context/theme-context';
import { DatingLayout } from './authen-routes/dating-route/dating-layout';

const FeedRoute = lazy(
  delayLoad(() => import('./authen-routes/feed-route/feed-route'))
);
import LoginRoute from './guest-routes/login-route/login-route';
import { SettingsLayout } from '../layout/settings-layout/settings-layout';
const ForgotPasswordRoute = lazy(
  delayLoad(() =>
    import('./guest-routes/forgot-password-route/forgot-password-route')
  )
);
const SettingsSecurityRoute = lazy(
  delayLoad(() =>
    import(
      './authen-routes/settings-route/settings-security-route/settings-security-route'
    )
  )
);
const SettingsBlockRoute = lazy(
  delayLoad(() =>
    import(
      './authen-routes/settings-route/settings-block-route/settings-block-route'
    )
  )
);
const SettingsGeneralRoute = lazy(
  delayLoad(() =>
    import(
      './authen-routes/settings-route/settings-general-route/settings-general-route'
    )
  )
);
const ProfileFeed = lazy(
  delayLoad(() =>
    import(
      './authen-routes/user-profile-route/upr-body/profile-feed/profile-feed'
    )
  )
);
const ProfileAbout = lazy(
  delayLoad(() =>
    import(
      './authen-routes/user-profile-route/upr-body/profile-about/profile-about'
    )
  )
);
const ProfileFriends = lazy(
  delayLoad(() =>
    import(
      './authen-routes/user-profile-route/upr-body/profile-friend/profile-friend'
    )
  )
);
const DatingRoute = lazy(
  delayLoad(() => import('./authen-routes/dating-route/dating-route'))
);
const DatingRegister = lazy(
  delayLoad(() =>
    import('./authen-routes/dating-route/datingRegister/datingRegister')
  )
);

const AccountConfirmationRoute = lazy(
  delayLoad(() =>
    import('./guest-routes/account-confirmation/account-confirmation')
  )
);
const ChangePasswordRoute = lazy(
  delayLoad(() =>
    import('./guest-routes/change-password-route/change-password-route')
  )
);
const MarketplaceRoute = lazy(
  delayLoad(() => import('./authen-routes/marketplace-route/marketplace-route'))
);
const MarketplaceCreateListing = lazy(
  delayLoad(() =>
    import(
      './authen-routes/marketplace-route/marketplace-create-listing/marketplace-create-listing'
    )
  )
);
const PostRoute = lazy(
  delayLoad(() => import('./authen-routes/post-route/post-route'))
);
const UserProfileRoute = lazy(
  delayLoad(() =>
    import('./authen-routes/user-profile-route/user-profile-route')
  )
);
const CreateListingDetail = lazy(
  delayLoad(() =>
    import(
      './authen-routes/marketplace-route/marketplace-create-listing/create-listing-detail/create-listing-detail'
    )
  )
);
const ListingSelling = lazy(
  delayLoad(() =>
    import('./authen-routes/marketplace-route/listing-selling/listing-selling')
  )
);

const EditListing = lazy(
  delayLoad(() =>
    import(
      './authen-routes/marketplace-route/listing-selling/edit-listing/edit-listing'
    )
  )
);
const ShowEachCategory = lazy(
  delayLoad(() =>
    import(
      './authen-routes/marketplace-route/show-each-category/show-each-category'
    )
  )
);
const ListingFullDisplay = lazy(
  delayLoad(() =>
    import(
      './authen-routes/marketplace-route/listing-full-display/listing-full-display'
    )
  )
);
const SavedListing = lazy(
  delayLoad(() =>
    import('./authen-routes/marketplace-route/saved-listing/saved-listing')
  )
);

import { RequireProfileRoute } from './route-types/require-profile-route';
import { NotRequireProfileRoute } from './route-types/not-require-profile-route';
import { DatingProfile } from './authen-routes/dating-route/dating-profile/dating-profile';

const GlobalSearchResult = lazy(
  delayLoad(() =>
    import('./authen-routes/global-search-result/global-search-result')
  )
);

export const NotificationStateContext = React.createContext();

class MainRoute extends React.Component {
  constructor(props) {
    super(props);
    // fetch("https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tinh_tp.json")
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <Suspense fallback={<OverlayLoading darkMode={darkMode} />}>
            <WithRouterKappaLayout>
              {(layoutProps) => (
                <CustomSwitch>
                  <FlexibleRoute
                    {...layoutProps}
                    path={'/'}
                    exact
                    render={(props) =>
                      !authenCache.getAuthen() ? (
                        <LoginRoute {...props} />
                      ) : (
                        <FeedRoute {...props} />
                      )
                    }
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/tim-kiem'}
                    exact
                    render={(props) => <GlobalSearchResult {...props} />}
                  />
                  <GuestRoute
                    {...layoutProps}
                    path={'/quen-mat-khau'}
                    exact
                    render={(props) => <ForgotPasswordRoute {...props} />}
                  />
                  <GuestRoute
                    {...layoutProps}
                    path={'/xac-thuc-tai-khoan'}
                    exact
                    render={(props) => <AccountConfirmationRoute {...props} />}
                  />
                  <GuestRoute
                    {...layoutProps}
                    path={'/doi-mat-khau'}
                    exact
                    render={(props) => <ChangePasswordRoute {...props} />}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/marketplace'}
                    exact
                    render={(props) => <MarketplaceRoute {...props} />}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/marketplace/create'}
                    exact
                    render={(props) => <MarketplaceCreateListing {...props} />}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/marketplace/create/:categoryName'}
                    exact
                    render={(props) => <CreateListingDetail {...props} />}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/marketplace/:categoryID'}
                    exact
                    render={(props) => <ShowEachCategory {...props} />}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/marketplace/listing/:listingID'}
                    exact
                    render={(props) => <ListingFullDisplay {...props} />}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/marketplace/you/selling'}
                    exact
                    render={(props) => <ListingSelling {...props} />}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/marketplace/you/saved'}
                    exact
                    render={(props) => <SavedListing {...props} />}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/marketplace/edit/:listingID'}
                    exact
                    render={(props) => <EditListing {...props} />}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/dating'}
                    //exact
                    render={(props) => (
                      <DatingLayout {...props}>
                        {(datingProps) => {
                          return (
                            <>
                              <RequireProfileRoute
                                {...datingProps}
                                exact
                                path={'/dating'}
                                render={(props) => <DatingRoute {...props} />}
                              />
                              <RequireProfileRoute
                                {...datingProps}
                                exact
                                path={'/dating/profile'}
                                render={(props) => <DatingProfile {...props} />}
                              />
                              <NotRequireProfileRoute
                                {...datingProps}
                                exact
                                path={'/dating/register'}
                                render={(props) => (
                                  <DatingRegister {...props} />
                                )}
                              />
                            </>
                          );
                        }}
                      </DatingLayout>
                    )}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/post/:postID'}
                    exact
                    render={(props) => <PostRoute {...props} />}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/user/:userID'}
                    // exact
                    render={(props) => (
                      <UserProfileRoute {...props}>
                        {(uprProps) => (
                          <>
                            <Route
                              exact
                              path={'/user/:userID'}
                              render={(props) => (
                                <ProfileFeed {...props} {...uprProps} />
                              )}
                            />
                            <Route
                              exact
                              path={'/user/:userID/about'}
                              render={(props) => (
                                <ProfileAbout {...props} {...uprProps} />
                              )}
                            />
                            <Route
                              exact
                              path={'/user/:userID/friends'}
                              render={(props) => (
                                <ProfileFriends {...props} {...uprProps} />
                              )}
                            />
                          </>
                        )}
                      </UserProfileRoute>
                    )}
                  />
                  <AuthenRoute
                    {...layoutProps}
                    path={'/settings'}
                    // exact
                    render={(props) => (
                      <SettingsLayout {...props}>
                        {(uprProps) => (
                          <>
                            <Route
                              exact
                              path={'/settings/general'}
                              render={(props) => (
                                <SettingsGeneralRoute
                                  {...props}
                                  {...uprProps}
                                />
                              )}
                            />
                            <Route
                              exact
                              path={'/settings/security'}
                              render={(props) => (
                                <SettingsSecurityRoute
                                  {...props}
                                  {...uprProps}
                                />
                              )}
                            />
                            <Route
                              exact
                              path={'/settings/blocked'}
                              render={(props) => (
                                <SettingsBlockRoute {...props} {...uprProps} />
                              )}
                            />
                          </>
                        )}
                      </SettingsLayout>
                    )}
                  />
                </CustomSwitch>
              )}
            </WithRouterKappaLayout>
          </Suspense>
        )}
      </ThemeContext.Consumer>
    );
  }
}

class NotificationPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  enableNotification = () => {
    Notification.requestPermission((result) => {
      console.log('User Choice', result);
      if (result !== 'granted') {
        console.log('No notification permission granted!');
      } else {
        // configurePushSub();
        this.props.onChange(false);
        let options = {
          body: 'Các thông báo quan trọng của bạn sẽ được hiển thị ở đây.',
          icon: '/assets/images/icons/app-icon-192x192.png',
          dir: 'ltr',
          lang: 'en-US',
          vibrate: [100, 50, 200],
          badge: '/assets/images/icons/app-icon-192x192.png',
          tag: 'confirm-notification',
          renotify: true,
        };
        navigator.serviceWorker.ready.then((swreg) => {
          swreg.showNotification('Bật thông báo thành công!', options);
        });
      }
    });
  };

  render() {
    return this.props.value ? (
      <div className='notification-prompt'>
        Kappa cần sự cho phép của bạn để{' '}
        <span onClick={this.enableNotification}>Bật thông báo</span>.
      </div>
    ) : null;
  }
}

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotificationPrompt:
        'Notification' in window &&
        'serviceWorker' in navigator &&
        Notification.permission !== 'granted',
    };
  }

  render() {
    return (
      <div className='app'>
        <ThemeController>
          {() => (
            <>
              <NotificationPrompt
                value={this.state.showNotificationPrompt}
                onChange={(value) =>
                  this.setState({ showNotificationPrompt: value })
                }
              />
              <div id='main-route'>
                <Router history={customHistory}>
                  <NotificationStateContext.Provider
                    value={this.state.showNotificationPrompt}
                  >
                    <MainRoute />
                  </NotificationStateContext.Provider>
                  <ModalsRegistry />
                  <TopFloatNotificationRegistry />
                  <BottomNotificationRegistry />
                </Router>
              </div>
            </>
          )}
        </ThemeController>
      </div>
    );
  }
}
