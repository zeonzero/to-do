import React from 'react';

import Home from '../../route/Home';

import '../../style/index.scss';
import './style.scss';

const Layout = () => {
  return (
    <div className="layout">
      <header>
        <div className="container">
          <h1>To - do List</h1>
        </div>
      </header>
      <main>
        <Home/>
      </main>
    </div>
  );
};

export default Layout;