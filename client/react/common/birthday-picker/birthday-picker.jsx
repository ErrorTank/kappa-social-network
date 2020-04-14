import React, {Component} from 'react';
import {generateArrayFromRange} from "../../../common/utils/array-utils";

const currentYear = new Date().getFullYear();

console.log(currentYear)

const years = generateArrayFromRange(currentYear - 80, currentYear - 10);

const months =  generateArrayFromRange(1, 12);

export class BirthdayPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {...props.value} || {
            day: 12,
            month: 1,
            year: 1998
        }
    }
    render() {
        return (
            <div className="birthday-picker">

            </div>
        );
    }
}
