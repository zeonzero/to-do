import React, { useState } from 'react';
import { arrayOf, number, object, func } from 'prop-types';
import  DatePicker  from 'react-datepicker';

import Card, {CardBody, CardFooter, CardHeader} from "../Card";
import {LS_TODO} from "../../core/constants";

import "react-datepicker/dist/react-datepicker.css";
import './style.scss';

const formValidation = { //inclusive
  title: {
    min: 3,
    max: 30
  },
  description: {
    min: 3,
    max: 255
  }
};

const ToDoForm = ({editToDoIndex, toDoList, onHandleClose}) => {
  const toDoItem = typeof editToDoIndex === 'number' ? toDoList[editToDoIndex] : {};
  const [ title, setTitle ] = useState(toDoItem.title || '');
  const [ description, setDescription ] = useState(toDoItem.description || '');
  const [ isTitleValidated, setIsTitleValidated ] = useState(false);
  const [ isDescValidated, seIsDescValidated ] = useState(false);
  const [dateTime, setDateTime ] = useState(toDoItem.dateTime || new Date());

  const titleValidation = title.length < formValidation.title.min || title.length > formValidation.title.max || !/[a-z0-9 ]+$/gim.test(title);
  const descriptionValidation = description.length < formValidation.description.min || description.length > formValidation.description.max || !/[a-z0-9 ]+$/gim.test(description);

  const handleInput = e => {
    if(e.preventDefault) {
      e.preventDefault();
    }

    const { target } = e;
    const { name, value } = target;

    switch(name) {
      case 'title': {
        if(value.length > formValidation.title.max || (!/[a-z0-9 ]+$/gim.test(value) && value)) {
          return;
        }

        setIsTitleValidated(false);
        setTitle(value);
        break;
      }
      case 'description': {
        if(value.length > formValidation.description.max || (!/[a-z0-9 ]+$/gim.test(value) && value)) {
          return;
        }
        seIsDescValidated(false);
        setDescription(value);
        break;
      }
      case 'dateTime': {
        if(!value) {
          return;
        }

        setDateTime(value);
        break;
      }

      default: {
        return;
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if(titleValidation || descriptionValidation || !dateTime) {
      if(titleValidation) {
        setIsTitleValidated(true);
      }

      if(descriptionValidation) {
        seIsDescValidated(true);
      }

      return;
    }
    const dateTimestamp = new Date(dateTime).getTime();

    if(typeof editToDoIndex === 'number') {
      toDoList[editToDoIndex] = {
        title,
        description,
        dateTime: dateTimestamp
      };
    }else {
      toDoList.push({
        title,
        description,
        dateTime: dateTimestamp
      });
    }

    localStorage.setItem(LS_TODO, JSON.stringify(toDoList));

    onHandleClose(toDoList);
  };

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={() => onHandleClose()}/>
      <form className="to-do-form">
        <Card>
          <CardHeader className="form-header">
            <h2>Something New To Do</h2>
          </CardHeader>
          <CardBody className="form-body">
            <div className="input-container">
              <label htmlFor="title">Title:</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Min 3 Characters"
                aria-placeholder="Min. 3 Characters"
                value={title}
                min={formValidation.title.min}
                max={formValidation.title.max}
                pattern={/[a-z0-9 ]+$/gim}
                autoComplete="off"
                aria-autocomplete="none"
                onChange={handleInput}
              />
              {isTitleValidated && (
                <span className="form-error-msg">Title need to be 3 characters or more</span>
              )}
            </div>
            <div className="input-container">
              <label htmlFor="description">Description:</label>
              <div className="textarea-container">
              <textarea
                id="description"
                name="description"
                placeholder="Min: 3 Character"
                aria-placeholder="Min: 3 Character"
                value={description}
                onChange={handleInput}
              />
              <p className="description-note">
                {isDescValidated && (
                  <span className="form-error-msg">Description need to be 3 characters or more</span>
                )}
                <span className="character-counter">{description.length}/{formValidation.description.max}</span>
              </p>
              </div>
            </div>
            <div className="input-container">
              <label htmlFor="dateTime">Date & Time:</label>
              <DatePicker
                selected={dateTime}
                onChange={date => handleInput({
                  target: {
                    name: 'dateTime',
                    value: date
                  }
                })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                timeCaption="time"
                dateFormat="d-MM-yyyy, h:mmaa"
              />
            </div>
          </CardBody>
          <CardFooter
            buttonList={[
              {
                className: "footer-btn",
                btnType: 'info',
                text: 'Save',
                onClick: handleSubmit,
                type: 'submit'
              },
              {
                className: "footer-btn",
                btnType: 'warning',
                text: 'Cancel',
                onClick: (e) => {
                  e.preventDefault();
                  onHandleClose();
                },
                type: 'reset'
              }
            ]}
          />
        </Card>
      </form>
    </div>
  );
};

ToDoForm.propTypes = {
  editToDoIndex: number,
  toDoList: arrayOf(object),
  onHandleClose: func
};

export default ToDoForm;