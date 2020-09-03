import React, {useState, useRef} from 'react';
import moment from "moment";
moment.locale("vi");

export const LastActive = ({lastActive}) => {
    let [value, setValue] = useState(moment(lastActive).fromNow());

    useRef(() => {
        let interval = setInterval(() => {
            setValue(moment(lastActive).fromNow());
        }, 60000)
        return () => clearInterval(interval)
    })

    return value
};
