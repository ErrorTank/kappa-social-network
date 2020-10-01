import React, { Component } from 'react';
import classnames from 'classnames';
import { customHistory } from '../../routes/routes';

export class MenuNavigationWithIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: this.props.mainID && this.props.mainID === this.props.id && 'main',
    };

    if (this.props.options && !!this.props.options.length)
      this.props.options.forEach((e) => {
        if (this.props.mainID === e._id) {
          this.setState({ focus: 'sup' });
        }
      });
  }
  render() {
    let {
      className,
      id,
      icon,
      darkMode,
      title,
      type,
      onClick,
      options = [],
      mainID,
      link,
      ...other
    } = this.props;
    const { focus } = this.state;
    console.log(options);
    return (
      <div
        className={classnames(
          'menu-navigation-with-icon',
          type || focus || `${type}`
        )}
        onClick={() => customHistory.push(link)}
      >
        <div className='menu-navigation-wrapper'>
          {icon && (
            <div className='mn-icon'>
              <i className={icon}></i>
            </div>
          )}
          <div className='mn-title-wrapper'>
            <span className='mn-title'>{title}</span>
          </div>
        </div>
        {focus &&
          options.map((e) => (
            <div
              className={classnames('children-navigation-wrapper')}
              key={e._id}
              onClick={() => customHistory.push(e.link)}
            >
              <div className='children-navigation'>{e.name}</div>
            </div>
          ))}
      </div>
    );
  }
}
