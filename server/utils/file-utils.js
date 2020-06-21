const isImage = fileName => {
    return (/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(fileName)
};

module.exports = {
    isImage
};