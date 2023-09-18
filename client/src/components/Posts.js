import "./Posts.css";
import Pagination from "./Pagination";
import { useState } from 'react';
import {  useSelector } from "react-redux";
import { selectPosts, selectPage } from "../reducers/posts";
import Modal from 'react-modal';

const Posts = () => {
  const postsPerPage = 9;
  const posts = useSelector(selectPosts);
  const page = useSelector(selectPage);
  const [modalEvent, setModalEvent] = useState({
    id: Symbol(0),
    Event: Symbol("hide"),
    payload: Symbol({})
  });
  const setModalIsOpenToTrue =(itemId, e, p)=>{
    setModalEvent({id: itemId, Event: e, payload: p});
  };
  const setModalIsOpenToFalse =()=>{
    setModalEvent({id: 0, Event: "hide", payload: {}});
  };
  let parsed = JSON.parse(JSON.stringify(posts));
  let parseResult = [];
  let result = {};
  if(parsed) {
    result = (parsed.result) 
    for(var i = 0; i < result.length; i++) {
      if (result[i] !== '')  {
        parseResult.push([result[i].id, result[i].title, result[i].username, result[i].imageSrc, result[i].likes, result[i].dislikes, result[i].date, result[i].comments]);
      }
    }
    parseResult.reverse();
  };    
  const indexOfLastPost = page * postsPerPage; 
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = parseResult.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (page) => (page);
    return (
    <div>
      <div className="grid-container">
      {currentPosts.map((post) => (
        <div className="grid-item" onClick={() => setModalIsOpenToTrue(post[0], "fullscreen", ({ Title : post[1], Url : post[3] }))} style={{backgroundImage: `url(${post[3]})`}} key={post[0]}>{post[1]} | {post[0]} | </div>
      ))}
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={parseResult.length}
        paginate={paginate}
      />
      <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalEvent.Event !== "hide"}  appElement={document.getElementById('root') || undefined}>
      {(() => {
        if (modalEvent.Event === "hide") {
          return (
            <div></div>
          )
        } else if (modalEvent.Event === "fullscreen") {
          return (
            <div>
              <h3>Fullscreen photo</h3>
              <h1>{modalEvent.payload.Title}</h1>
              <img alt="Fullscreen" src={modalEvent.payload.Url} onClick={setModalIsOpenToFalse} ></img>
            </div>
          )
        } else if (modalEvent.Event === "deletePost") {
          return (
            <div>
              <h3>Delete post dialog</h3>
              <h6>{modalEvent.id}</h6>
            </div>
          )
        } else if (modalEvent.Event === "editPost") {
          return (
            <div>
              <h3>Edit post dialog</h3>
              <h6>{modalEvent.Item}</h6>
            </div>
          )       
        } else if (modalEvent.Event === "newComment") {
          return (
            <div>
              <h3>newComment dialog</h3>
              <h6>{modalEvent.Item}</h6>
            </div>
          )       
        } else if (modalEvent.Event === "editComment") {
          return (
            <div>
              <h3>editComment dialog</h3>
              <h6>{modalEvent.Item}</h6>
            </div>
          )       
        } else if (modalEvent.Event === "deleteComment") {
          return (
            <div>
              <h3>Delete post dialog</h3>
              <h6>{modalEvent.Item}</h6>
            </div>
          )       
        }
      })()}
      </ Modal>
    </div>
    );
};

export default Posts;