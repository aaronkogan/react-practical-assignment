import "./Posts.css";
import Pagination from "./Pagination";
import Panel from "./Panel";
import { useState, useEffect } from 'react';
import {  useSelector, useDispatch } from "react-redux";
import {  selectPosts, getPosts, selectSearchQuery, selectPage, searchQuery, currentPage } from "../reducers/posts";
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
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const postQuery = useSelector(selectQuery);
  const search = useSelector(selectSearchQuery);
  const page = useSelector(selectPage);
  const [pagesCount, setPagesCount] = useState(1);
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
  const parseResult = [];
  const parsed = posts?.result?.map((obj) => obj);
  useEffect(() => {
    const lastPageFetch = async (query) => {
      const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
      const json = await res.json();
      json.success && setPagesCount(json.totalPages);
      (json.totalPages !== 0) ? ((json.totalPages !== 1) ? fetchPosts(`http://localhost:8080/post/page/${json.totalPages}`) : dispatch(currentPage(json.page)) && dispatch(getPosts(json))) : (dispatch(currentPage(1)));
      };
    const fetchPosts = async (query) => {
      const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
      const json = await res.json();
      json.success && dispatch(currentPage(json.page)) && dispatch(getPosts(json));
      console.warn("FetchPosts: "+ JSON.stringify(json));
      };
    switch (postQuery.event) {
      case 'firstStart': {
        dispatch(resetEvent());
        lastPageFetch('http://localhost:8080/post/page/1');
        break;
      } 
      case 'newPost': {
        console.warn("posts newPost event: "+ JSON.stringify(postQuery));
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        if(parsed?.length < 9) {
          parsed?.push(request);
          if(search === '') {
            dispatch(resetEvent());
            dispatch(currentPage(pagesCount));
            dispatch(getPosts({result : parsed}));
            } else {
            dispatch(searchQuery(""));
            document.getElementById('search').value="";
            dispatch(resetEvent());
            lastPageFetch(`http://localhost:8080/post/page/1`);
            }
          } else {
            dispatch(searchQuery(""));
            document.getElementById('search').value="";
            dispatch(resetEvent());
            lastPageFetch(`http://localhost:8080/post/page/1`); 
          }
        break;
      }
      case 'editPost': {
        console.warn("Posts editPost event: "+ JSON.stringify(postQuery));
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        for (var j = 0; j < parsed?.length; j++){
          if (parsed[j].id === postQuery.id){
            parsed[j] = request;
            dispatch(resetEvent());
            dispatch(getPosts({result : parsed}));
            setModalEvent({Event: "hide"});
            break;
          }
        }
        break;
      }
      case 'deletePost': {
        if(parsed?.length > 1) {
          if(search === '') {
            dispatch(resetEvent());
            fetchPosts(`http://localhost:8080/post/page/${page}`);
            } else {
            dispatch(searchQuery(""));
            document.getElementById('search').value="";
            dispatch(resetEvent());
            lastPageFetch(`http://localhost:8080/post/page/1`); 
          }
        } else {
          dispatch(searchQuery(""));
          document.getElementById('search').value="";
          dispatch(resetEvent());
          lastPageFetch(`http://localhost:8080/post/page/1`); 
        }
          setModalEvent({Event: "hide"});
          break;
        } 
        case 'editPostLike': {
          console.warn("Posts likePost event: "+ JSON.stringify(postQuery));
          const request = JSON.parse(JSON.stringify(postQuery));
          delete request["event"];
          for (var j = 0; j < parsed?.length; j++){
            if (parsed[j].id === postQuery.id){
              parsed[j] = request;
              dispatch(resetEvent());
              dispatch(getPosts({result : parsed}));
              break;
            }
          }
          break;
        }
        case 'editPostDislike': {
          console.warn("Posts dislikePost event: "+ JSON.stringify(postQuery));
          const request = JSON.parse(JSON.stringify(postQuery));
          delete request["event"];
          for (var j = 0; j < parsed?.length; j++){
            if (parsed[j].id === postQuery.id){
              parsed[j] = request;
              dispatch(resetEvent());
              dispatch(getPosts({result : parsed}));
              break;
            }
          }
          break;
        }
        default: {
          console.warn("Posts unregistered event: "+ JSON.stringify(postQuery));
          break;
        }
    }
     },[postQuery, dispatch, parsed, search, page, pagesCount]);
  if(parsed) {
    for(var i = 0; i < parsed.length; i++) {
      if (parsed[i] !== '')  {
        parseResult.push([parsed[i].id, parsed[i].title, parsed[i].username, parsed[i].imageSrc, parsed[i].likes, parsed[i].dislikes, parsed[i].date, parsed[i].comments]);
        }
      }
    parseResult.reverse();
    };    
    return (
    <div>
      <div className="posts-container">
      {parseResult.map((post) => (  
        isTouchScreenDevice() ?   
            <div className="posts-item" onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3], likes: post[4], dislikes: post[5], date: post[6], comments: post[7] }))} style={{backgroundImage: `url(${post[3]})`}} key={post[0]}><div>{post[0]}</div>           
              {<div>
                <div onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3], likes: post[4], dislikes: post[5], date: post[6], comments: post[7] }))}>{post[1]}<br/>by {post[2]}</div>
                  <div style={{paddingLeft : "-25%", justifyContent: "center", position: "center", display: "flex", flexDirection: "row"}}>
                    <Panel id={post[0]} title={post[1]} owner={post[2]} url={post[3]} likes={post[4]} dislikes={post[5]} date={post[6]} comments={post[7]}/>
                  </div>
              </div>}
            </div> 
            :
            <div className="posts-item" onMouseEnter={() => setHoverId(post[0])}  onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3], likes: post[4], dislikes: post[5], date: post[6], comments: post[7] }))} style={{backgroundImage: `url(${post[3]})`}} key={post[0]}><div>{post[0]}</div>           
            {(hoverId === post[0]) ? 
              <div>
                <div onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3], likes: post[4], dislikes: post[5], date: post[6], comments: post[7] }))}>{post[1]}<br/>by {post[2]}</div>
              <div style={{paddingLeft : "-25%", justifyContent: "center", position: "center", display: "flex", flexDirection: "row"}}>
                <Panel id={post[0]} title={post[1]} owner={post[2]} url={post[3]} likes={post[4]} dislikes={post[5]} date={post[6]} comments={post[7]}/></div>
              </div> 
            : 
              <div onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title : post[1], owner: post[2], url : post[3] }))} style={{color: "Transparent"}}>{post[1]}<br/>by {post[2]} {post[8]}</div>
            }
          </div> 
      ))}
      <div className="posts-item">
        <footer style={{ justifyContent: "center", display: "flex", flexDirection: "row" }}><Pagination pagesCount={pagesCount}/></footer>
      </div>
    </div>
      <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalEvent.Event !== "hide"} className={`main-modal-${modalEvent.Event}`}  appElement={document.getElementById('root') || undefined}>
      {(() => {
          if (modalEvent.Event === "fullscreen") {
          return (
            <div>
              {modalEvent.payload.title} by {modalEvent.payload.owner}
              <img onClick={e => e.currentTarget === e.target && setModalIsOpenToFalse} alt={modalEvent.payload.title} className={`main-modal-${modalEvent.Event}-img`} src={modalEvent.payload.url}></img>
              <div className="posts-panel"><Panel id={modalEvent.id} title={modalEvent.payload.title} owner={modalEvent.payload.owner} url={modalEvent.payload.url} likes={modalEvent.payload.likes} dislikes={modalEvent.payload.dislikes} comments={modalEvent.payload.comments}/></div>
            </div>
          )
        }
      })()}
      </ Modal>
    </div>
    );
};

export default Posts;