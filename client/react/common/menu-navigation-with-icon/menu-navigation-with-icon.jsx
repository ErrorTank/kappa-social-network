import React, { Component } from 'react';
import classnames from 'classnames';
import { customHistory } from '../../routes/routes';

export class MenuNavigationWithIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: '',
    };
  }
  componentDidMount() {
    this.checkFocus();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.mainID !== this.props.mainID) {
      this.checkFocus();
    }
  }
  checkFocus = () => {
    const { mainID, id, options } = this.props;

    if (mainID) {
      if (mainID === id) {
        this.setState({ focus: 'main' });
      } else if (!!options.length) {
        options.forEach((e) => {
          if (mainID === e._id) {
            this.setState({ focus: 'sup' });
          }
        });
        this.state.focus !== 'sup' && this.setState({ focus: '' });
      } else {
        this.setState({ focus: '' });
      }
    }
  };
  render() {
    let {
      className,
      id,
      icon,
      darkMode,
      title,
      type = false,
      onClick,
      options = [],
      mainID,
      link,
      ...other
    } = this.props;
    const { focus } = this.state;
    return (
      <div
        className={classnames(
          'menu-navigation-with-icon',
          type || focus || `${type}`
        )}
      >
        <div
          className='menu-navigation-wrapper'
          onClick={() => customHistory.push(link)}
        >
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
              className={classnames('children-navigation-wrapper', {
                child: mainID === e._id,
              })}
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
