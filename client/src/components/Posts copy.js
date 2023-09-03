import "./Posts.css";
import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getPost,editPost,deletePost,selectPosts } from "../reducers/posts";


const Posts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const posts = useSelector(selectPosts);
  let parsed = JSON.parse(JSON.stringify(posts));
  let result = {};
  let parseResult = [];
  const renderData = data => {
    return data.map((post, i) => {
      return (
        <div key={i}>
          <div key={i+1}>{post} | {i+1} | </div>
          <hr />
        </div>
      );
    });
  };
  if(parsed) {
    result = (parsed["result"]) 
    console.log("77777 result: "+JSON.stringify(result));
    for(var i = 0; i < result.length; i++) {
      parseResult[result[i].id] = [result[i].id, result[i].title, result[i].username, result[i].imageSrc, result[i].likes, result[i].dislikes, result[i].date, result[i].comments];
    }
    parseResult.shift();
    renderData(result);
  }    
  // get current post
  const indexOfLastPost = currentPage * postsPerPage; // 1 * 10 = 10
  const indexOfFirstPost = indexOfLastPost - postsPerPage; // 10 - 10 = 0
  const currentPosts = parseResult.slice(indexOfFirstPost, indexOfLastPost); // 0 to 10
  const paginate = pageNumber => setCurrentPage(pageNumber);


  console.log("88888 "+JSON.stringify(parseResult));
    return (
      <div>
      <div className="posts">
      <article role="main">
      {currentPosts}
      </article>
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={parseResult.length}
        paginate={paginate}
      />
    </div>
      //   <div className="posts">
      //       <article role="main">
      //           {parseResult.map((post, i) => (
      //                   <div key={i+1}>{post} | {i+1} | </div>
      //               ))}
      //       </article>
      //       <p>
      //       {parseResult.length}
      //       </p>
      // </div>
    );
};

export default Posts;