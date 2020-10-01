import React, { Component } from 'react';
import { customHistory } from '../../../../routes';
import { MenuNavigationWithIcon } from './../../../../../common/menu-navigation-with-icon/menu-navigation-with-icon';

export class CategoriesSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { categoryDisplay, mainID } = this.props;
    return (
      <div className='categories-section'>
        <div className='line-seperate'></div>
        <h2 className='categories-section-title'>Danh muc</h2>
        {categoryDisplay &&
          categoryDisplay.map((each) => {
            console.log(each._id);
            return (
              <MenuNavigationWithIcon
                key={each.name}
                icon={each.icon}
                title={each.name}
                type={each.type}
                options={each.children}
                id={each._id}
                link={each.link}
                mainID={mainID}
              />
            );
          })}
      </div>
    );
  }
}
