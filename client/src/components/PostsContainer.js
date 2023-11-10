import "./Posts.css";
import  { lastPageFetch, fetchPosts }  from "../services/Api";
import timeConverter from "../utils/TimeConverter";
import isTouchScreenDevice from "../utils/TouchScreenDetect";
import Pagination from "./Pagination";
import PostPanel from "./PostPanel";
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectPosts, getPosts, selectSearchQuery, selectPage, selectPostsUpdate, updatePosts, searchQuery, currentPage, resetPosts } from "../reducers/posts";
import { selectCommentsQuery, resetCommentsEvent, hideCommentsEvent } from "../reducers/comments";
import { selectPostQuery, resetPostEvent } from "../reducers/post";
import Modal from 'react-modal'


const PostsContainer = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const postQuery = useSelector(selectPostQuery);
  const commentsQuery = useSelector(selectCommentsQuery);
  const search = useSelector(selectSearchQuery);
  const page = useSelector(selectPage);
  const postsUpdate = useSelector(selectPostsUpdate);
  const [pagesCount, setPagesCount] = useState(1);
  const [hoverId, setHoverId] = useState(0);
  const [localEvent, setlocalEvent] = useState({ id: 0, Event: "hide", payload: {} });
  const [parseResult, setParseResult] = useState([]);
  const parsed = posts?.result?.map((obj) => obj);
  const setModalIsOpenToTrue = useCallback((itemId, e, p) => { dispatch(hideCommentsEvent()) && setlocalEvent({ id: itemId, Event: e, payload: p }) },[dispatch]);
  const setModalIsOpenToFalse = useCallback(() => { setlocalEvent({ id: 0, Event: "hide", payload: {} }) },[]);
  const parsedProcess = useCallback(() => {
    if (parsed) { 
      const parsedProcess = [];
      for (var i = 0; i < parsed.length; i++) { if (parsed[i] !== '') {
         parsedProcess.push([parsed[i].id, parsed[i].title, parsed[i].username, parsed[i].imageSrc, parsed[i].likes, parsed[i].dislikes, timeConverter(parsed[i].date), parsed[i].comments]) 
        }}
      parsedProcess.reverse();
      setParseResult(parsedProcess);
    }},[parsed]);
  const getlastPage = useCallback(async () => {
    const json = await lastPageFetch();
    json.success && setPagesCount(json.totalPages);
    dispatch(currentPage(json.page));
    dispatch(getPosts(json));
    dispatch(updatePosts(true));
  },[dispatch]);
  const pagePosts = useCallback(async (query) => {
    const json = await fetchPosts(query);
    json.success && setPagesCount(json.totalPages);
    (pagesCount < currentPage) ? (dispatch(currentPage(pagesCount))) : (dispatch(currentPage(json.page)))
    dispatch(getPosts(json));
    dispatch(updatePosts(true));
  },[dispatch, pagesCount]);
  useEffect(() => {
    var j = 0;
    switch (postQuery.event) {
      case 'firstStart': {
        dispatch(resetPostEvent());
        getlastPage();
        break;
      }
      case 'newPost': {
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        if (parsed?.length < 9) {
          parsed?.push(request);
          if (search === '') {
            dispatch(resetPostEvent());
            dispatch(currentPage(pagesCount));
            dispatch(getPosts({ result: parsed }));
            dispatch(updatePosts(true));
          } else {
            document.getElementById('search').value = "";
            dispatch(searchQuery("")); 
            dispatch(resetPostEvent()); 
            getlastPage();
          }
        } else {
          document.getElementById('search').value = "";
          dispatch(searchQuery("")); 
          dispatch(resetPostEvent()); 
          getlastPage();
        }
        break;
      }
      case 'editPost': {
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        for (j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === postQuery.id) {
            request.comments = parsed[j].comments;
            parsed[j] = request;
            dispatch(resetPostEvent());
            dispatch(getPosts({ result: parsed }));
            dispatch(updatePosts(true));
            setModalIsOpenToTrue(postQuery.id, localEvent.Event, ({ title: parsed[j].title, owner: parsed[j].username, url: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: timeConverter(parsed[j].date), comments: parsed[j].comments }));
            break;
          }
        }
        break;
      }
      case 'deletePost': {
        if (parsed?.length > 1) {
          if (search === '') { 
            dispatch(resetPostEvent());
            pagePosts(page); 
          } else {
            document.getElementById('search').value = "";
            dispatch(searchQuery(""));
            dispatch(resetPostEvent());
            getlastPage();
          }
        } else {
          document.getElementById('search').value = "";
          dispatch(searchQuery(""));
          dispatch(resetPostEvent());
          dispatch(resetPosts());
          getlastPage();
        }
        setModalIsOpenToFalse();
        break;
      }
      case 'editPostLike': {
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        for (j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === postQuery.id) {
            request.comments = parsed[j].comments;
            parsed[j] = request;
            dispatch(resetPostEvent());
            dispatch(getPosts({ result: parsed }));
            dispatch(updatePosts(true));
            break;
          }
        }
        break;
      }
      case 'editPostDislike': {
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        for (j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === postQuery.id) {
            request.comments = parsed[j].comments;
            parsed[j] = request;
            dispatch(resetPostEvent());
            dispatch(getPosts({ result: parsed }));
            dispatch(updatePosts(true));
            break;
          }
        }
        break;
      }
      default: break;
    }
    switch (commentsQuery.event) {
      case 'addComment': {
        const request = JSON.parse(JSON.stringify(commentsQuery));
        delete request["event"];
        for (j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === commentsQuery.postId) {
            parsed[j] = { id: parsed[j].id, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...parsed[j].comments, request] };
            dispatch(resetCommentsEvent());
            dispatch(getPosts({ result: parsed }));
            dispatch(updatePosts(true));
            break;
          }
        }
        break;
      }
      case 'editComment': {
        const request = JSON.parse(JSON.stringify(commentsQuery));
        delete request["event"];
        for (j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === commentsQuery.postId) {
            parsed[j] = { id: parsed[j].id, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...request.comments] };
            dispatch(resetCommentsEvent());
            dispatch(getPosts({ result: parsed }));
            dispatch(updatePosts(true));
            setModalIsOpenToFalse();
            break;
          }
        }
        break;
      }
      case 'editCommentLike': {
        const request = JSON.parse(JSON.stringify(commentsQuery));
        delete request["event"];
        for (j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === commentsQuery.postId) {
            parsed[j] = { id: commentsQuery.postId, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...request.comments] };
            dispatch(resetCommentsEvent());
            dispatch(getPosts({ result: parsed }));
            dispatch(updatePosts(true));
            break;
          }
        }
        break;
      }
      case 'editCommentDislike': {
        const request = JSON.parse(JSON.stringify(commentsQuery));
        delete request["event"];
        for (j = 0; j < parsed.length; j++) {
          if (parsed[j].id === commentsQuery.postId) {
            parsed[j] = { id: commentsQuery.postId, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...request.comments] };
            dispatch(resetCommentsEvent());
            dispatch(getPosts({ result: parsed }));
            dispatch(updatePosts(true));
            break;
          }
        }
        break;
      }
      case 'deleteComment': {
        for (j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === commentsQuery.postId) {
            parsed[j] = { id: commentsQuery.postId, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...commentsQuery?.comments] };
            dispatch(resetCommentsEvent());
            dispatch(getPosts({ result: parsed }));
            dispatch(updatePosts(true));
            break;
          }
        }
        break;
      }
      default:  break;
    }
    if (postsUpdate) { parsedProcess(); dispatch(updatePosts(false)); }
  }, [postQuery, commentsQuery, dispatch, parsed, search, page, pagesCount, getlastPage, pagePosts, localEvent, parsedProcess, postsUpdate, setModalIsOpenToFalse, setModalIsOpenToTrue]);
  return (
    <div>
      <div className="posts-container">
        {parseResult.map((post) => (
          <div
            className="posts-item"
            onMouseEnter={() => setHoverId(post[0])}
            onClick={e => e.currentTarget === e.target && setModalIsOpenToTrue(post[0], "fullscreen", ({ title: post[1], owner: post[2], url: post[3], likes: post[4], dislikes: post[5], date: post[6], comments: post[7] }))}
            style={{ backgroundImage: `url(${post[3]})` }}
            key={post[0]}>{(hoverId === post[0] || isTouchScreenDevice()) &&
              <div>
                <div
                  onClick={e => e.currentTarget === e.target &&
                    setModalIsOpenToTrue(post[0], "fullscreen", ({ title: post[1], owner: post[2], url: post[3], likes: post[4], dislikes: post[5], date: post[6], comments: post[7] }))}>{post[0]}<br/>{post[6]}<br />{post[1]} by {post[2]}</div>
                <div className="posts-panel">
                  <PostPanel id={post[0]} title={post[1]} owner={post[2]} url={post[3]} likes={post[4]} dislikes={post[5]} date={post[6]} comments={post[7]} />
                </div>
              </div>}
          </div>
        ))}
        <div className="posts-item">
          <footer><Pagination pagesCount={pagesCount} /></footer>
        </div>
      </div>
      <Modal onRequestClose={setModalIsOpenToFalse} isOpen={localEvent.Event !== "hide" } className={`main-modal-${localEvent.Event}`} appElement={document.getElementById('root') || undefined}>
        {(() => {
          if (localEvent.Event === "fullscreen") {
            return (
              <div>
                {localEvent.payload.date} <br />
                {localEvent.payload.title} by {localEvent.payload.owner}
                <img onClick={e => e.currentTarget === e.target && setModalIsOpenToFalse} alt={localEvent.payload.title} className={`main-modal-${localEvent.Event}-img`} src={localEvent.payload.url}></img>
                <div className="posts-panel-modal"><PostPanel id={localEvent.id} title={localEvent.payload.title} owner={localEvent.payload.owner} url={localEvent.payload.url} likes={localEvent.payload.likes} dislikes={localEvent.payload.dislikes} date={localEvent.payload.date} comments={localEvent.payload.comments} /></div>
              </div>
            )
          }
        })()}
      </ Modal>
    </div>
  )
};

export default PostsContainer;