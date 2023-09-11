import "./Posts.css";
import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getPost,editPost,deletePost,selectPosts } from "../reducers/posts";

const Posts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const posts = useSelector(selectPosts);
  let parsed = JSON.parse(JSON.stringify(posts));
  let result = {};
  let parseResult = [];
  if(parsed) {
    result = (parsed["result"]) 
    for(var i = 0; i < result.length; i++) {
      if (result[i] != '')  {
      parseResult.push([result[i].id, result[i].title, result[i].username, result[i].imageSrc, result[i].likes, result[i].dislikes, result[i].date, result[i].comments]);
      }
    }
    parseResult.reverse();
    if (parseResult[0]) parseResult.shift();
  }    
  const indexOfLastPost = currentPage * postsPerPage; 
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = parseResult.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = pageNumber => setCurrentPage(pageNumber);
    return (
    <div>
      <div className="grid-container">
      {currentPosts.map((post, i) => (
        <div className="grid-item" key={post[0]}>{post} | {post[0]} | </div>
      ))}
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={parseResult.length}
        paginate={paginate}
      />
    </div>
    );
};

export default Posts;