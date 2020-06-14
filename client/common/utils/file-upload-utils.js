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

export {
    formatBytes,
    checkFileSizeExceed,
    isImageFile,
    getBase64Image
}