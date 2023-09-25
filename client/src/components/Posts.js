import "./Posts.css";
import Pagination from "./Pagination";
import Panel from "./Panel";
import { useState } from 'react';
import {  useSelector, useDispatch } from "react-redux";
import {  selectPosts, selectPage, getPosts, selectSearchQuery, searchQuery, currentPage } from "../reducers/posts";
import { selectQuery, resetEvent } from "../reducers/post";
import Modal from 'react-modal';

const isTouchScreenDevice = () => {
  try{
      document.createEvent('TouchEvent');
      return true;
  }catch(e){
      return false;
  }
}

const Posts = () => {
  const postsPerPage = 9;
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const page = useSelector(selectPage);
  const postQuery = useSelector(selectQuery);
  const search = useSelector(selectSearchQuery);
  const [hoverId, setHoverId] = useState(0);
  const [modalEvent, setModalEvent] = useState({
    id: 0,
    Event: "hide",
    payload: {}
  });
  const indexOfLastPost = page * postsPerPage; 
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const fetchPosts = async (query) => {
    const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
    const json = await res.json();
    json.success && dispatch(getPosts(json));
    };
  const setModalIsOpenToTrue = (itemId, e, p) => {
    setModalEvent({id: itemId, Event: e, payload: p});
  };
  const setModalIsOpenToFalse  =() => {
    setModalEvent({id: 0, Event: "hide", payload: {}});
  };
  const parsed = posts?.result.map((obj) => obj)
  switch (postQuery.event) {
    case 'deletePost': {
      for (var j = 0; j < parsed?.length; j++){
        if (parsed[j].id === postQuery.id){
          parsed?.splice(j,1);
          dispatch(resetEvent());
          dispatch(getPosts({result : parsed}));
          setModalEvent({Event: "hide"})
          break;
        }
      }
      break;
      }
      case 'newPost': {
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        parsed?.push(request);
        if(search === '') {
        dispatch(resetEvent());
        dispatch(currentPage(1));
        dispatch(getPosts({result : parsed}));
        } else {
          dispatch(searchQuery(""));
          document.getElementById('search').value="";
          dispatch(resetEvent());
          dispatch(currentPage(1));
          fetchPosts('http://localhost:8080/post/');
        }
        break;
      }
        case 'firstStart': {
          dispatch(resetEvent());
          fetchPosts('http://localhost:8080/post/');
          break;
       }  
        default: break;
    }
  const parseResult = [];
  if(parsed) {
        for(var i = 0; i < parsed.length; i++) {
          if (parsed[i] !== '')  {
            parseResult.push([parsed[i].id, parsed[i].title, parsed[i].username, parsed[i].imageSrc, parsed[i].likes, parsed[i].dislikes, parsed[i].date, parsed[i].comments]);
           }
          }
        parseResult.reverse();
    };    
  const currentPosts = parseResult.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (page) => (page);
    return (
    <div>
      <div className="posts-container">
      {currentPosts.map((post) => (  
        isTouchScreenDevice() ?   
            <div className="posts-item" onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3] }))} style={{backgroundImage: `url(${post[3]})`}} key={post[0]}><div>{post[0]}</div>           
              {<div><div onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3] }))}>{post[1]}<br/>by {post[2]}</div><div style={{paddingLeft : "-25%", justifyContent: "center", position: "center", display: "flex", flexDirection: "row"}}><Panel id={post[0]} title={post[1]} owner={post[2]} url={post[3]}/></div></div>}
            </div> 
            :
            <div className="posts-item" onMouseEnter={() => setHoverId(post[0])} onMouseLeave={() => setHoverId(0)} onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3] }))} style={{backgroundImage: `url(${post[3]})`}} key={post[0]}><div>{post[0]}</div>           
            {(hoverId === post[0]) ? 
            <div><div onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3] }))}>{post[1]}<br/>by {post[2]}</div><div style={{paddingLeft : "-25%", justifyContent: "center", position: "center", display: "flex", flexDirection: "row"}}><Panel id={post[0]} title={post[1]} owner={post[2]} url={post[3]}/></div></div> 
            : 
            <div onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3] }))} style={{color: "Transparent"}}>{post[1]}<br/>by {post[2]} {post[8]}</div>
            }
          </div> 
      ))}
      </div>
      <div style={{ justifyContent: "center", position: "center", display: "flex", flexDirection: "row"}}>
      <Pagination postsPerPage={postsPerPage} totalPosts={parseResult.length} paginate={paginate} page={page}/>
      </div>
      <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalEvent.Event !== "hide"} className={`main-modal-${modalEvent.Event}`}  appElement={document.getElementById('root') || undefined}>
      {(() => {
          if (modalEvent.Event === "fullscreen") {
          return (
            <div>
              {modalEvent.payload.title} by {modalEvent.payload.owner}
              <img onClick={e => e.currentTarget === e.target && setModalIsOpenToFalse} alt={modalEvent.payload.title} className={`main-modal-${modalEvent.Event}-img`} src={modalEvent.payload.url}></img>
              <div  style={{ bottom : "-35px", marginLeft : "20%", justifyContent: "center", position: "relative", display: "flex", flexDirection: "column"}}><Panel id={modalEvent.id} title={modalEvent.payload.title} owner={modalEvent.payload.owner} url={modalEvent.payload.url}/></div>
            </div>
          )
        }
      })()}
      </ Modal>
    </div>
    );
};

export default Posts;