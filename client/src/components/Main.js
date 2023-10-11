import React from "react";
import Posts from './Posts';
import Header from './Header';
import Search from './Search';
import AddPost from './PostAdd';

const Main = () => {
  return (
    <div>
      <Header/><Search/><AddPost/><Posts/>
    </div>
  );
};

export default Main;