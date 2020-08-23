const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const checkFileSizeExceed = (size, limitSize) => {
    return size > limitSize
}

const isImageFile = (filename) => {
    return (/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(filename);
}
const getBase64Image = (file)=>new Promise((resolve)=>{
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        resolve(reader.result);
    };


});

const getBase64ImageFromUrl = url => new Promise(resolve => {
    let img = new Image();

    // onload fires when the image is fully loadded, and has width and height

    img.onload = function(){

        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let dataURL = canvas.toDataURL("image/png");
            dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

        resolve(dataURL); // the base64 string

    };

    // set attributes and src
    img.setAttribute('crossOrigin', 'anonymous'); //
    img.src = url;
})

const getFileBlobFromUrl = url => new Promise(resolve => {
    return fetch(url)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
            resolve(blob)
        });
})

const _getImage = (src) => {
    const img = new Image();
    // img.crossOrigin = "anonymous";
    img.src = src;

    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = e => console.error(e);
    });
};

const readFileAsDataUrl = (fileObject) => {
    return new Promise((resolve, reject) => {
        let fr = new FileReader;

        fr.onload = function() {
            resolve(fr.result);
        };

        fr.onerror = function() {
            reject();
        };

        fr.readAsDataURL(fileObject);
    })
};

const getImageDimensions = (img) => {
    let promise = null;
    if (typeof img == "object") {
        promise = readFileAsDataUrl(img).then(url => _getImage(url));
    } else {
        promise = _getImage(img);
    }

    return promise.then(imgFile => ({
        width: imgFile.width,
        height: imgFile.height,
    }))
};

const calculateNewDimensions = (dimensions, maxWidth, maxHeight) => {
  let {width, height} = dimensions;
  let ratio = width / height;
};

export {
    formatBytes,
    checkFileSizeExceed,
    isImageFile,
    getBase64Image,
    getImageDimensions,
    calculateNewDimensions,
    getBase64ImageFromUrl,
    getFileBlobFromUrl
}