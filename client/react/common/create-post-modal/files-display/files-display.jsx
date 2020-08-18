import React from 'react';
import {FileDisplay} from "./file-display/file-display";


export const FilesDisplay = ({files, onSelect, onRemove}) => {
    return (
        <div className="create-post-files-display">
            {files.map(each => {
                return (
                    <FileDisplay
                        key={each.fileID}
                        file={each}
                        onSelect={() => onSelect(each)}
                        onRemove={() => onRemove(each)}
                    />
                )
            })}
        </div>
    );
};