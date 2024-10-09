import React from 'react';
import Contents from '../components/layout/Contents.jsx';

import Header from '../components/home/header.jsx';
import Intro from '../components/home/Intro.jsx';
import Port from '../components/home/Port.jsx';
import Youtube from '../components/home/Youtube.jsx';

const Home = () => {
  return (
    <>
      <Contents>
        <Header attr="header__wrap score section" />
        <Intro attr="intro__wrap score3 section" />
        <Port attr="port__wrap score3 section center" />
        <Youtube attr="youtube__wrap score3 section" />
      </Contents>
    </>
  );
};

export default Home;
