import React from "react";
import Header from './Header';
import Search from './Search';
import AddPost from './PostAdd';
import PostsContainer from "./PostsContainer";

const Main = () => {
  return (
    <div>
      <Header /><Search /><AddPost /><PostsContainer />
    </div>
  );
};

export default Main;