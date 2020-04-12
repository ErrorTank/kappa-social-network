
export const registerServiceWorker = () => {

    if ('serviceWorker' in navigator) {
        let swDir = "./sw.js";
        return navigator.serviceWorker
            .register(swDir)
            .then(function () {
                console.log('Service worker registered!');
            })
            .catch(function(err) {
                console.log(err);
            });
    }
    console.log("Service worker is not supported!");
    return Promise.resolve();
};

