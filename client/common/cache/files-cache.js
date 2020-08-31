import {utilityApi} from "../../api/common/utilities-api";

export const createDetectionsCache = (getFileID) => {
    let detectionsMap = {};
    return {
        setDetections: (file, detections) => detectionsMap[getFileID(file)] = detections,
        getDetections: async (file, displaySize, isBase64 = true) => {

            if (detectionsMap[getFileID(file)]) {
                return detectionsMap[getFileID(file)]
            }

            return (isBase64 ? utilityApi.detectImageFaces(file.file, displaySize, "file") : utilityApi.detectImageFaces2(file.path, displaySize))
                .then(data => {

                    detectionsMap[getFileID(file)] = [...data];

                    return data;
                })
        }
    }
}

export const detectionsCache = createDetectionsCache(file => file.fileID);
export const postFilesDetectionsCache = createDetectionsCache(file => file._id);