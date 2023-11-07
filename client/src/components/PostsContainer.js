import "./Posts.css";
import  { lastPageFetch, fetchPosts }  from "../services/Api";
import timeConverter from "../utils/TimeConverter";
import isTouchScreenDevice from "../utils/TouchScreenDetect";
import Pagination from "./Pagination";
import PostPanel from "./PostPanel";
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectPosts, getPosts, selectSearchQuery, selectPage, searchQuery, currentPage, resetPosts } from "../reducers/posts";
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
  const [pagesCount, setPagesCount] = useState(1);
  const [hoverId, setHoverId] = useState(0);
  const [modalEvent, setModalEvent] = useState({ id: 0, Event: "hide", payload: {} });
  const parseResult = [];
  const parsed = posts?.result?.map((obj) => obj);
  useEffect(() => {
    const getlastPage = async () => {
      const json = await lastPageFetch();
      json.success && setPagesCount(json.totalPages);
      dispatch(currentPage(json.page)) && dispatch(getPosts(json));
    };
    const pagePosts = async (query) => {
      const json = await fetchPosts(query);
      json.success && setPagesCount(json.totalPages);
      (pagesCount < currentPage) ? (dispatch(currentPage(pagesCount))) : (dispatch(currentPage(json.page)))
      dispatch(getPosts(json));
    };
    var j = 0;
    switch (commentsQuery.event) {
      case 'addComment': {
        const request = JSON.parse(JSON.stringify(commentsQuery));
        delete request["event"];
        for (j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === commentsQuery.postId) {
            parsed[j] = { id: parsed[j].id, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...parsed[j].comments, request] };
            dispatch(resetCommentsEvent()) && dispatch(getPosts({ result: parsed }));
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
            dispatch(resetCommentsEvent()) && dispatch(getPosts({ result: parsed }));
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
            dispatch(resetCommentsEvent()) && dispatch(getPosts({ result: parsed }));
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
            dispatch(resetCommentsEvent()) && dispatch(getPosts({ result: parsed }));
            break;
          }
        }
        break;
      }
      case 'deleteComment': {
        for (j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === commentsQuery.postId) {
            parsed[j] = { id: commentsQuery.postId, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...commentsQuery?.comments] };
            dispatch(resetCommentsEvent()) && dispatch(getPosts({ result: parsed }));
            break;
          }
        }
        break;
      }
      default: break;
    }
    switch (postQuery.event) {
      case 'firstStart': {
        dispatch(resetPostEvent()) && getlastPage();
        break;
      }
      case 'newPost': {
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        if (parsed?.length < 9) {
          parsed?.push(request);
          if (search === '') {
            dispatch(resetPostEvent()) && dispatch(currentPage(pagesCount)) && dispatch(getPosts({ result: parsed }));
          } else {
            document.getElementById('search').value = "";
            dispatch(searchQuery("")) && dispatch(resetPostEvent()) && getlastPage();
          }
        } else {
          document.getElementById('search').value = "";
          dispatch(searchQuery("")) && dispatch(resetPostEvent()) && getlastPage();
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
            dispatch(resetPostEvent()) && dispatch(getPosts({ result: parsed })) && setModalEvent({ Event: "hide" });
            break;
          }
        }
        break;
      }
      case 'deletePost': {
        if (parsed?.length > 1) {
          if (search === '') { dispatch(resetPostEvent()) && pagePosts(page) } else {
            document.getElementById('search').value = "";
            dispatch(searchQuery("")) && dispatch(resetPostEvent()) && getlastPage();
          }
        } else {
          document.getElementById('search').value = "";
          dispatch(searchQuery("")) && dispatch(resetPostEvent()) && dispatch(resetPosts()) && getlastPage();
        }
        setModalEvent({ Event: "hide" });
        break;
      }
      case 'editPostLike': {
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        for (j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === postQuery.id) {
            request.comments = parsed[j].comments;
            parsed[j] = request;
            dispatch(resetPostEvent()) && dispatch(getPosts({ result: parsed }));
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
            dispatch(resetPostEvent()) && dispatch(getPosts({ result: parsed }));
            break;
          }
        }
        break;
      }
      default: break;
    }
  }, [postQuery, commentsQuery, dispatch, parsed, search, page, pagesCount]);
  const setModalIsOpenToTrue = useCallback((itemId, e, p) => { dispatch(hideCommentsEvent()) && setModalEvent({ id: itemId, Event: e, payload: p }) },[dispatch]);
  const setModalIsOpenToFalse = useCallback(() => { setModalEvent({ id: 0, Event: "hide", payload: {} }) },[]);
  if (parsed) { for (var i = 0; i < parsed.length; i++) { if (parsed[i] !== '') { parseResult.push([parsed[i].id, parsed[i].title, parsed[i].username, parsed[i].imageSrc, parsed[i].likes, parsed[i].dislikes, timeConverter(parsed[i].date), parsed[i].comments]) } }
    parseResult.reverse();
  };
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
                    setModalIsOpenToTrue(post[0], "fullscreen", ({ title: post[1], owner: post[2], url: post[3], likes: post[4], dislikes: post[5], date: post[6], comments: post[7] }))}>{post[6]}<br />{post[1]} by {post[2]}</div>
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
      <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalEvent.Event !== "hide"} className={`main-modal-${modalEvent.Event}`} appElement={document.getElementById('root') || undefined}>
        {(() => {
          if (modalEvent.Event === "fullscreen") {
            return (
              <div>
                {modalEvent.payload.date} <br />
                {modalEvent.payload.title} by {modalEvent.payload.owner}
                <img onClick={e => e.currentTarget === e.target && setModalIsOpenToFalse} alt={modalEvent.payload.title} className={`main-modal-${modalEvent.Event}-img`} src={modalEvent.payload.url}></img>
                <div className="posts-panel-modal"><PostPanel id={modalEvent.id} title={modalEvent.payload.title} owner={modalEvent.payload.owner} url={modalEvent.payload.url} likes={modalEvent.payload.likes} dislikes={modalEvent.payload.dislikes} date={modalEvent.payload.date} comments={modalEvent.payload.comments} /></div>
              </div>
            )
          }
        })()}
      </ Modal>
    </div>
  )
};

export default PostsContainer;