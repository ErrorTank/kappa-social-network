import React from 'react';

export class Radio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { checked, label, onChange, id, value } = this.props;

    return (
      <div className='kappa-radio'>
        <input
          type='radio'
          checked={checked}
          className='kappa-radio-input'
          id={id}
          value={value}
          onChange={() => {
            // console.log('cacac');
            onChange();
          }}
        />
        <label className='kappa-radio-label' htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }
}
