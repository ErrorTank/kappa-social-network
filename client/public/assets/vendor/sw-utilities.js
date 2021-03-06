
var dbPromise = idb.open('kappa-index-db', 1, function (db) {
    if (!db.objectStoreNames.contains('sync-chats')) {
        db.createObjectStore('sync-chats', {keyPath: '_id'});

    }
    if (!db.objectStoreNames.contains('login-sessions')) {
        db.createObjectStore('login-sessions', {keyPath: '_id'});
    }
    if (!db.objectStoreNames.contains('user-info')) {
        db.createObjectStore('user-info', {keyPath: '_id'});
    }
    if (!db.objectStoreNames.contains('contacts')) {
        db.createObjectStore('contacts', {keyPath: '_id'});
    }
    if (!db.objectStoreNames.contains('birthdays')) {
        db.createObjectStore('birthdays', {keyPath: '_id'});
    }
    if (!db.objectStoreNames.contains('group_chats')) {
        db.createObjectStore('group_chats', {keyPath: '_id'});
    }
});

function writeData(st, data) {
    return dbPromise
        .then(function(db) {
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            store.put(data);
            return tx.complete;
        });
}

function readAllData(st) {
    return dbPromise
        .then(function(db) {
            var tx = db.transaction(st, 'readonly');
            var store = tx.objectStore(st);
            return store.getAll();
        });
}

function clearAllData(st) {
    return dbPromise
        .then(function(db) {
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            store.clear();
            return tx.complete;
        });
}

function deleteItemFromData(st, id) {
    dbPromise
        .then(function(db) {
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            store.delete(id);
            return tx.complete;
        })
        .then(function() {
            console.log('Item deleted!');
        });
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], {type: mimeString});
    return blob;
}