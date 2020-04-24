import React from 'react';
import { string, func, oneOf, node } from 'prop-types';

import './style.scss';

const Button = ({className, btnType, text, onHandleClick, children, ...rest}) => {
  return (
    <div className="btn-component">
      <button
        {...rest}
        className={`${btnType}${className ? ` ${className}` : ''}`}
        onClick={onHandleClick}
      >
        {children ? children : text}
      </button>
    </div>
  );
};

Button.propTypes = {
  btnType: oneOf(['info', 'warning', 'danger']),
  className: string,
  children: node,
  text: string,
  onHandleClick: func.isRequired
};

export default Button;