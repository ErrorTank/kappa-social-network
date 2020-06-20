importScripts('/assets/vendor/idb.js');
importScripts('/assets/vendor/sw-utilities.js');
var exceptionRequestsDev = [
  {
    endpoint: 'http://localhost:4000/api/register',
    method: 'POST',
  },
  {
    endpoint: 'http://localhost:4000/api/session/check',
    method: 'POST',
  },
  {
    endpoint: 'http://localhost:4000/api/confirm-token/resend',
    method: 'POST',
  },
  {
    endpoint: 'http://localhost:4000/api/verify-user',
    method: 'POST',
  },
  {
    endpoint: 'http://localhost:4000/api/user/init-credentials',
    method: 'GET',
  },
  {
    endpoint: 'http://localhost:4000/api/user/login',
    method: 'POST',
  },
  {
    endpoint: 'http://localhost:4000/api/user/send-change-password-token',
    method: 'POST',
  },
  {
    endpoint: 'http://localhost:4000/api/user/verify-change-password-token',
    method: 'POST',
  },
  {
    endpoint: 'http://localhost:4000/api/user/resend-change-password-token',
    method: 'POST',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/user\/change-password\/brief\/session\//,
    method: 'GET',
  },
  {
    endpoint: 'http://localhost:4000/api/user/change-password',
    method: 'PUT',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/utility\/search-global/,
    method: 'GET',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/utility\/pre-search/,
    method: 'GET',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/user\/search-history\/history/,
    method: 'DELETE',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/user\/search-history\/history/,
    method: 'PUT',
  },
  {
    endpoint: 'http://localhost:4000/api/user/search-history/create',
    method: 'POST',
  },
  {
    endpoint: 'http://localhost:4000/api/user/short-login',
    method: 'POST',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/user\/\w+\/basic-info/,
    method: 'GET',
  },
  {
    endpoint: 'http://localhost:4000/api/user/toggle-dark-mode',
    method: 'PUT',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/utility\/search\/dialogs/,
    method: 'GET',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/utility\/search-for-create\/dialogs/,
    method: 'GET',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/utility\/url\/\w+\/metadata/,
    method: 'GET',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/messenger\/status\/active/,
    method: 'GET',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/messenger\/bubble\/user\/\w+\/brief/,
    method: 'GET',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/messenger\/chat-room\/user\/\w+\/brief/,
    method: 'GET',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/chat\/\w+\/send-message/,
    method: 'POST',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/chat\/\w+\/messages\/seen-messages/,
    method: 'PUT',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/chat\/\w+\/messages\/update-to-sent/,
    method: 'PUT',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/chat\/\w+\/get-messages/,
    method: 'GET',
  },
  {
    endpoint: /http:\/\/localhost:4000\/api\/chat\/\w+\/mentions/,
    method: 'GET',
  },
];

var notGetRequests = [
  {
    endpoint: 'http://localhost:4000/api/utility/login-sessions/brief',
    method: 'POST',
    dbCollectionName: 'login-sessions',
  },
  {
    endpoint: 'http://localhost:4000/api/chat/contacts',
    method: 'GET',
    dbCollectionName: 'contacts',
  },
];

var CACHE_STATIC_NAME = 'static-v1592661117360';
var CACHE_DYNAMIC_NAME = 'dynamic-v1592661117360';

var STATIC_FILES = [
  '/',
  '/index.html',
  '/vendor.bundle.js',
  '/bundle.js',
  '/assets/vendor/jquery.js',
  '/assets/vendor/idb.js',
  '/assets/vendor/sw-utilities.js',
  '/main.css',
  '/assets/vendor/fonts/css/all.min.css',
  '/assets/images/icons/app-icon-32x32.png',
  '/assets/images/icons/app-icon-192x192.png',
  'https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i,700,700i|Montserrat:400,400i,500,500i,600,600i,700,700i|Open+Sans:400,400i,600,600i,700,700i|Roboto:400,400i,500,500i,700,700i&display=swap&subset=latin-ext,vietnamese',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
  '/assets/vendor/fonts/webfonts/fa-brands-400.eot',
  '/assets/vendor/fonts/webfonts/fa-brands-400.svg',
  '/assets/vendor/fonts/webfonts/fa-brands-400.ttf',
  '/assets/vendor/fonts/webfonts/fa-brands-400.woff',
  '/assets/vendor/fonts/webfonts/fa-brands-400.woff2',
  '/assets/vendor/fonts/webfonts/fa-duotone-900.eot',
  '/assets/vendor/fonts/webfonts/fa-duotone-900.svg',
  '/assets/vendor/fonts/webfonts/fa-duotone-900.ttf',
  '/assets/vendor/fonts/webfonts/fa-duotone-900.woff',
  '/assets/vendor/fonts/webfonts/fa-duotone-900.woff2',
  '/assets/vendor/fonts/webfonts/fa-light-300.eot',
  '/assets/vendor/fonts/webfonts/fa-light-300.svg',
  '/assets/vendor/fonts/webfonts/fa-light-300.ttf',
  '/assets/vendor/fonts/webfonts/fa-light-300.woff',
  '/assets/vendor/fonts/webfonts/fa-light-300.woff2',
  '/assets/vendor/fonts/webfonts/fa-regular-400.eot',
  '/assets/vendor/fonts/webfonts/fa-regular-400.svg',
  '/assets/vendor/fonts/webfonts/fa-regular-400.ttf',
  '/assets/vendor/fonts/webfonts/fa-regular-400.woff',
  '/assets/vendor/fonts/webfonts/fa-regular-400.woff2',
  '/assets/vendor/fonts/webfonts/fa-solid-900.eot',
  '/assets/vendor/fonts/webfonts/fa-solid-900.svg',
  '/assets/vendor/fonts/webfonts/fa-solid-900.ttf',
  '/assets/vendor/fonts/webfonts/fa-solid-900.woff',
  '/assets/vendor/fonts/webfonts/fa-solid-900.woff2',
];

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function (cache) {
      console.log('[Service Worker] Precaching App Shell');
      cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

function isInArray(string, array) {
  let host = self.location.host;
  let sliceIndex = string.indexOf(host) + host.length;
  var cachePath;
  if (
    string.indexOf(self.location.host) ===
    self.location.protocol.length + 2
  ) {
    cachePath = string.substring(sliceIndex);
  } else {
    cachePath = string;
  }
  for (var path of array) {
    if (typeof path === 'string' && path === cachePath) {
      return true;
    }
    if (typeof path === 'object' && path.test(string)) {
      return true;
    }
  }
  return false;
}

function isExceptionRequest(request) {
  return isInArray(
    request.url,
    exceptionRequestsDev
      .filter(function (each) {
        return each.method == request.method;
      })
      .map(function (each) {
        return each.endpoint;
      })
  );
}
function isNotGetRequest(request) {
  return isInArray(
    request.url,
    notGetRequests
      .filter(function (each) {
        return each.method == request.method;
      })
      .map(function (each) {
        return each.endpoint;
      })
  );
}

function getEndpointConfig(request, arr) {
  let array = arr
    .filter(function (each) {
      return each.method == request.method;
    })
    .map(function (each) {
      return each;
    });
  let string = request.url;
  let host = self.location.host;
  let sliceIndex = string.indexOf(host) + host.length;
  var cachePath;
  if (
    string.indexOf(self.location.host) ===
    self.location.protocol.length + 2
  ) {
    cachePath = string.substring(sliceIndex);
  } else {
    cachePath = string;
  }
  for (var path of array) {
    if (typeof path.endpoint === 'string' && path.endpoint === cachePath) {
      return path;
    }
    if (typeof path.endpoint === 'object' && path.endpoint.test(string)) {
      return path;
    }
  }
  return null;
}

self.addEventListener('fetch', function (event) {
  var notGetEndpointConfig = getEndpointConfig(
    event.request.clone(),
    notGetRequests
  );
  if (notGetEndpointConfig) {
    event.respondWith(
      fetch(event.request).then(function (res) {
        var clonedRes = res.clone();
        clearAllData(notGetEndpointConfig.dbCollectionName)
          .then(function () {
            return clonedRes.json();
          })
          .then(function (data) {
            for (var key in data) {
              writeData(notGetEndpointConfig.dbCollectionName, data[key]);
            }
          });
        return res;
      })
    );
  } else if (isExceptionRequest(event.request.clone())) {
    return;
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request);
        }
      })
    );
  } else {
    if (
      event.request.url.indexOf('/sockjs-node/info?') > -1 ||
      event.request.url.indexOf('/socket.io')
    ) {
      return;
    } else {
      event.respondWith(
        caches.match(event.request).then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
                  // trimCache(CACHE_DYNAMIC_NAME, 3);
                  cache.put(event.request.url, res.clone());
                  return res;
                });
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME).then(function (cache) {
                  if (
                    event.request.headers.get('accept').includes('text/html')
                  ) {
                    return cache.match('/index.html');
                  }
                });
              });
          }
        })
      );
    }
  }
});

// self.addEventListener('sync', function(event) {
//     console.log('[Service Worker] Background syncing', event);
//     if (event.tag === 'sync-new-chats') {
//         console.log('[Service Worker] Syncing new Chats');
//         event.waitUntil(
//             readAllData('sync-chats')
//                 .then(function(data) {
//                     for (var dt of data) {
//                         var chatData = new FormData();
//
//                         var host = window.location.host;
//                         var protocol = window.location.protocol;
//                         fetch('https://us-central1-pwagram-99adf.cloudfunctions.net/storePostData', {
//                             method: 'POST',
//                             body: chatData
//                         })
//                             .then(function(res) {
//                                 console.log('Sent data', res);
//                                 if (res.ok) {
//                                     res.json()
//                                         .then(function(resData) {
//                                             deleteItemFromData('sync-posts', resData.id);
//                                         });
//                                 }
//                             })
//                             .catch(function(err) {
//                                 console.log('Error while sending data', err);
//                             });
//                     }
//
//                 })
//         );
//     }
// });

self.addEventListener('notificationclick', function (event) {
  var notification = event.notification;
  var action = event.action;

  console.log(notification);

  if (action === 'confirm') {
    console.log('Confirm was chosen');
    notification.close();
  } else {
    console.log(action);
    event.waitUntil(
      clients.matchAll().then(function (clis) {
        var client = clis.find(function (c) {
          return c.visibilityState === 'visible';
        });

        if (client !== undefined) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
  }
});

self.addEventListener('notificationclose', function (event) {
  console.log('Notification was closed', event);
});

self.addEventListener('push', function (event) {
  console.log('Push Notification received', event);

  var data = {
    title: 'New!',
    content: 'Something new happened!',
    openUrl: '/',
  };

  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  var options = {
    body: data.content,
    icon: '/assets/images/icons/app-icon-192x192.png',
    badge: '/assets/images/icons/app-icon-192x192.png',
    data: {
      url: data.openUrl,
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
