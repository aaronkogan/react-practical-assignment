import "./Posts.css";
import "./Panel.css";
import Pagination from "./Pagination";
import Panel from "./Panel";
import { useState } from 'react';
import {  useSelector } from "react-redux";
import { selectPosts, selectPage } from "../reducers/posts";
import Modal from 'react-modal';

const Posts = () => {
  const postsPerPage = 9;
  const posts = useSelector(selectPosts);
  const page = useSelector(selectPage);
  const [hoverId, setHoverId] = useState(0);
  const [modalEvent, setModalEvent] = useState({
    id: 0,
    Event: "hide",
    payload: {}
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
      <div className="posts-container">
      {currentPosts.map((post) => (    
            <div className="posts-item" onMouseEnter={() => setHoverId(post[0])} onMouseLeave={() => setHoverId(0)} onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ Title : post[1], Author: post[2], Url : post[3] }))} style={{backgroundImage: `url(${post[3]})`}} key={post[0]}>           
              { (hoverId === post[0]) ? <div>{post[1]}<br/>by {post[2]}<Panel id={post[0]} owner={post[2]} url={post[3]}/></div> : <div style={{color: "Background"}}>{post[1]}<br/>by {post[2]} {post[8]}</div> }
            </div>
      ))}
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={parseResult.length}
        paginate={paginate}
      />
      <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalEvent.Event !== "hide"} className={`main-modal-${modalEvent.Event}`}  appElement={document.getElementById('root') || undefined}>
      {(() => {
          if (modalEvent.Event === "fullscreen") {
          return (
            <div>
              {modalEvent.payload.Title} by {modalEvent.payload.Author}
              <img onClick={e => e.currentTarget === e.target && setModalIsOpenToFalse} alt={modalEvent.payload.Title} className={`main-modal-${modalEvent.Event}-img`} src={modalEvent.payload.Url}></img>
              <div style={{marginLeft : "70%", bottom : "-10px"}}><Panel id={modalEvent.payload.id} owner={modalEvent.payload.Author} url={modalEvent.payload.Url}/></div>
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