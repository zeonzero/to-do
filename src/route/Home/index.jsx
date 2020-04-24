import React, { useState } from 'react';
import Observer from "@researchgate/react-intersection-observer";

import Card, { CardHeader, CardBody, CardFooter } from "../../components/Card";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import ToDoForm from "../../components/ToDoForm";

import {LS_TODO, TODO_FILTER} from "../../core/constants";

import './styles.scss';

const compare = (a, b, order) => {
  if(order === 'asc') {
    if (a > b) {
      return -1;
    }
    if (b > a) {
      return 1;
    }
  }else {
    if (a > b) {
      return 1;
    }
    if (b > a) {
      return -1;
    }
  }
  return 0;
};

const Home = () => {
  let lsData;
  const initialFilter = null;

  try {
    lsData = JSON.parse(localStorage.getItem(LS_TODO));
  }catch {
    lsData = []
  }

  const [ isIntersecting, setIsIntersection ] = useState(false);
  const [ openModal, setOpenModal ] = useState(false);
  const [ editToDoIndex, setEditToDoIndex ] = useState(null);
  const [toDoList, setToDoList ] = useState(lsData);
  const [ filter, setFilter] = useState(initialFilter);

  const { type, order } = filter || {};
  const filterOrder = order ? 'desc' : 'asc';

  const handleIntersection = (e) => {
    setIsIntersection(e.isIntersecting);
  };

  const handleFilter = itemType => {
    setFilter({
      type: itemType,
      order: type === itemType ? !order : false
    });
  };

  const handleResetFilter = () => {
    setFilter(null);
    setToDoList(lsData);
  };

  const handleOpenForm = (newData) => {
    setOpenModal(!openModal);

    if(newData) {
      if(typeof editToDoIndex !== "number"){
        handleResetFilter();
      }

      setToDoList([
        ...newData
      ]);
    }
    setEditToDoIndex(null);
  };

  const handleEditToDo = (e, index) => {
    e.preventDefault();

    setEditToDoIndex(index);
    setOpenModal(!openModal);
  };

  const handleDeleteToDo = (e, index) => {
    e.preventDefault();

    toDoList.splice(index, 1);

    Promise.resolve(localStorage.setItem(LS_TODO, JSON.stringify(toDoList))).then(() => {
      setToDoList([
        ...toDoList
      ]);
    });
  };

  return (
    <div className="home-page">
      <div className="container">
        <Observer onChange={handleIntersection} threshold={[1]}>
          <div className="to-do-header-observer">
            <div className={`to-do-header-container${isIntersecting ? '' : ' container fixed'}`}>
              <div className="to-do-filter-container">
                <div className="to-do-filter">
                  <span className="filter-title">Filter By:</span>
                  {TODO_FILTER.map((item, index) => {
                    const { type: itemType, title } = item;
                    return (
                      <div
                        key={index}
                        className="filter-item"
                        onClick={() => handleFilter(itemType)}
                      >
                        <span className="filter-type">{title}</span>
                        {itemType === type && (
                          <Icon
                            className={`filter-icon ${filterOrder}`}
                            icon="play3"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <Button className="reset-filter" btnType="info" onHandleClick={handleResetFilter} text="Reset"/>
              </div>
              <Button className="to-do-add" onHandleClick={() => handleOpenForm()}>
                <Icon className="add-icon-container" icon="plus"/>
                <span className="add-text">Add New To Do</span>
              </Button>
            </div>
          </div>
        </Observer>
        <div className="to-do-list">
          {(toDoList || [])
            .sort((a,b) => type !== undefined ? compare(a[type].toString().toLowerCase(), b[type].toString().toLowerCase(), filterOrder) : 0)
            .map((item, index) => {
              const itemIndex = toDoList.length - 1 - index;
              const { title, description, dateTime } = toDoList[itemIndex];

              return (
                <div className="to-do-item" key={index}>
                  <Card>
                    <CardHeader
                      title={title}
                      timestamp={dateTime}
                    />
                    <CardBody description={description}/>
                    <CardFooter
                      buttonList={[
                        {
                          className: "footer-btn",
                          btnType: 'info',
                          text: 'Edit',
                          onClick: e => handleEditToDo(e, itemIndex)
                        },
                        {
                          className: "footer-btn",
                          btnType: 'danger',
                          text: "Delete",
                          onClick: e => handleDeleteToDo(e, itemIndex)
                        }
                      ]}
                    />
                  </Card>
                </div>
              );
            })
          }
        </div>
      </div>
      {openModal && (
        <ToDoForm onHandleClose={handleOpenForm} toDoList={toDoList || []} editToDoIndex={editToDoIndex}/>
      )}
    </div>
  );
};

export default Home;