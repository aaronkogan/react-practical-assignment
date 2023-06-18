import React from "react";
import Header from './Header';
import Search from './Search';
import Posts from './Posts';
import AddPost from './NewPost';


const Main = () => {
  return (
    <div>
      <Header/><Search/><AddPost/><Posts/>
    </div>
  );
};
export default Main;