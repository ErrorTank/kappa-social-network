import React, {Component} from 'react';

export class ContentCollapse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            more: false
        }
    }
    render() {
        let {list, minItems = 5, render} = this.props;
        let {more} = this.state;
        let renderList = !more ? list.slice(0, minItems) : list;
        let btnText = !more ? "Nhiều hơn" : "Ít đi";
        let btnIcon = !more ? <i className="fal fa-angle-down"></i> : <i class="fal fa-angle-up"></i>;
        return (
            <div className="content-collapse">
                {renderList.map(((each, i) => (
                    <div key={i}>
                        {render(each)}
                    </div>
                )))}
                <div className="more-toggle">

                </div>
            </div>
        );
    }
}
