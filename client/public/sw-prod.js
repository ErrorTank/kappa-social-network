

var CACHE_STATIC_NAME = 'static-v1';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';
var STATIC_FILES = [
    '/',
    '/index.html',
    '/vendor.bundle.js',
    '/bundle.js',
    '/assets/vendor/jquery.js',
    '/assets/vendor/idb.js',
    '/assets/vendor/sw-utilities.js',
    '/main.css',
    "/assets/vendor/fonts/css/all.min.css",
    "/assets/images/icons/app-icon-32x32.png",
    "/assets/images/icons/app-icon-192x192.png",
    'https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i,700,700i|Montserrat:400,400i,500,500i,600,600i,700,700i|Open+Sans:400,400i,600,600i,700,700i|Roboto:400,400i,500,500i,700,700i&display=swap&subset=latin-ext,vietnamese',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'
];


self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                console.log('[Service Worker] Precaching App Shell');
                cache.addAll(STATIC_FILES);
            })
    )
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('[Service Worker] Removing old cache.', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

function isInArray(string, array) {
    var cachePath;
    if (string.indexOf(self.origin) === 0) {
        console.log('matched ', string);
        cachePath = string.substring(self.origin.length);
    } else {
        cachePath = string;
    }
    return array.indexOf(cachePath) > -1;
}

self.addEventListener('fetch', function (event) {
    console.log("dasdas")
    if (isInArray(event.request.url, STATIC_FILES)) {
        event.respondWith(
            caches.match(event.request)
        );
    } else {
        if(event.request.url.indexOf("/sockjs-node/info?")){
            return;
        }else{
            event.respondWith(
                caches.match(event.request)
                    .then(function (response) {
                        if (response) {
                            return response;
                        } else {
                            return fetch(event.request)
                                .then(function (res) {
                                    return caches.open(CACHE_DYNAMIC_NAME)
                                        .then(function (cache) {
                                            // trimCache(CACHE_DYNAMIC_NAME, 3);
                                            cache.put(event.request.url, res.clone());
                                            return res;
                                        })
                                })
                                .catch(function (err) {
                                    return caches.open(CACHE_STATIC_NAME)
                                        .then(function (cache) {
                                            if (event.request.headers.get('accept').includes('text/html')) {
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

self.addEventListener('notificationclick', function(event) {
    var notification = event.notification;
    var action = event.action;

    console.log(notification);

    if (action === 'confirm') {
        console.log('Confirm was chosen');
        notification.close();
    } else {
        console.log(action);
        event.waitUntil(
            clients.matchAll()
                .then(function(clis) {
                    var client = clis.find(function(c) {
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

self.addEventListener('notificationclose', function(event) {
    console.log('Notification was closed', event);
});

self.addEventListener('push', function(event) {
    console.log('Push Notification received', event);

    var data = {title: 'New!', content: 'Something new happened!', openUrl: '/'};

    if (event.data) {
        data = JSON.parse(event.data.text());
    }

    var options = {
        body: data.content,
        icon: '/assets/images/icons/app-icon-192x192.png',
        badge: '/assets/images/icons/app-icon-192x192.png',
        data: {
            url: data.openUrl
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});





















