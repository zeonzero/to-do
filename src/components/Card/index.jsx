import React from 'react';
import { arrayOf, object, node, number, string } from 'prop-types'
import moment from "moment";

import Button from "../Button";

import './styles.scss';

export const CardHeader = ({children, className, title, timestamp}) => {
  let isValidDate;

  try {
    isValidDate = !!moment(timestamp).format('D-MM-YYYY, h:mmA');
  }catch {
    isValidDate = false;
  }

  return (
    <div className={`card-header${className ? ` ${className}` : ''}`}>
      {children ? children: (
        <>
          <h3>{title}</h3>
          <span className="card-date-time">{isValidDate ? moment(timestamp).format('D-MM-YYYY, h:mmA') : 'Date is Invalid'}</span>
        </>
      )}
    </div>
  );
};

CardHeader.propTypes = {
  className: string,
  children: node,
  title: string,
  timestamp: number
};

export const CardBody = ({className, children, description}) => {
  return (
    <div className={`card-body${className ? ` ${className}` : ''}`}>
      {children ? children : (
        <p>{description}</p>
      )}

    </div>
  );
};

CardBody.propTypes = {
  className: string,
  children: node,
  description: string
};

export const CardFooter = ({buttonList, className, children}) => {
  return (
    <div className={`card-footer${className ? ` ${className}` : ''}`}>
      {children ? children : (
        <div className="btn-group">
          {(buttonList || []).map((btn, index) => {
            const { btnType, text, onClick, ...rest } = btn;

            return (
              <Button
                key={index}
                text={text}
                btnType={btnType}
                onHandleClick={onClick}
                {...rest}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

CardFooter.propTypes = {
  buttonList: arrayOf(object),
  className: string,
  children: node
};

const Card = ({className, children}) => {
  return (
    <div className={`card-component${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  className: string,
  children: node
};

export default Card;