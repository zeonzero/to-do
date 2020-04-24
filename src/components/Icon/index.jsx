import React from 'react';
import { string } from 'prop-types';

const Icon = ({className, icon}) => {
  return (
    <span className={`icon-container${className ? ` ${className}` : ''}`}><i className={`icon icon-${icon}`}/></span>
  );
};

Icon.propTypes = {
  className: string,
  icon: string.isRequired
};

export default Icon;