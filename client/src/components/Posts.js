import "./Posts.css";
import Pagination from "./Pagination";
import Panel from "./Panel";
import { useState } from 'react';
import {  useSelector, useDispatch } from "react-redux";
import { getPosts , selectPosts, selectPage } from "../reducers/posts";
import { selectQuery } from "../reducers/post";
import Modal from 'react-modal';

const Posts = () => {
  const postsPerPage = 9;
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const page = useSelector(selectPage);
  const postQuery = useSelector(selectQuery);
  const [hoverId, setHoverId] = useState(0);
  const [modalEvent, setModalEvent] = useState({
    id: 0,
    Event: "hide",
    payload: {}
  });

  const setModalIsOpenToTrue = (itemId, e, p) => {
    setModalEvent({id: itemId, Event: e, payload: p});
  };
  const setModalIsOpenToFalse  =() => {
    setModalEvent({id: 0, Event: "hide", payload: {}});
  };
  let parsed = JSON.parse(JSON.stringify(posts));
  let parseResult = [];
  if(parsed) {
    let result = {};
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
            <div className="posts-item" onMouseEnter={() => setHoverId(post[0])} onMouseLeave={() => setHoverId(0)} onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3] }))} style={{backgroundImage: `url(${post[3]})`}} key={post[0]}><div>{post[0]}</div>           
              {(hoverId === post[0]) ? <div><div onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3] }))}>{post[1]}<br/>by {post[2]}</div><div style={{paddingLeft : "-25%", justifyContent: "center", position: "center", display: "flex", flexDirection: "row"}}><Panel id={post[0]} title={post[1]} owner={post[2]} url={post[3]}/></div></div> : <div onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3] }))} style={{color: "Transparent"}}>{post[1]}<br/>by {post[2]} {post[8]}</div>}
            </div>
      ))}
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={parseResult.length}
        paginate={paginate}
      />
    </div>
      <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalEvent.Event !== "hide"} className={`main-modal-${modalEvent.Event}`}  appElement={document.getElementById('root') || undefined}>
      {(() => {
          if (modalEvent.Event === "fullscreen") {
          return (
            <div>
              {modalEvent.payload.title} by {modalEvent.payload.owner}
              <img onClick={e => e.currentTarget === e.target && setModalIsOpenToFalse} alt={modalEvent.payload.title} className={`main-modal-${modalEvent.Event}-img`} src={modalEvent.payload.url}></img>
              <div  style={{paddingLeft : "-25%", justifyContent: "center", position: "center", display: "flex", flexDirection: "row"}}><Panel id={modalEvent.id} title={modalEvent.payload.title} owner={modalEvent.payload.owner} url={modalEvent.payload.url}/></div>
            </div>
          )
        }
      })()}
      </ Modal>
    </div>
    );
};

export default Posts;