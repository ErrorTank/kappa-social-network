import React from 'react';
import {FileDisplay} from "./file-display/file-display";


export const FilesDisplay = ({files}) => {
    return (
        <div className="files-display">
            {files.map(each => {
                return (
                    <FileDisplay
                        key={each.fileID}
                        {...each}
                    />
                )
            })}
        </div>
    );
};