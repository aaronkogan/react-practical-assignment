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


const Posts = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const postQuery = useSelector(selectPostQuery);
  const commentsQuery = useSelector(selectCommentsQuery);
  const search = useSelector(selectSearchQuery);
  const page = useSelector(selectPage);
  const postsUpdate = useSelector(selectPostsUpdate);
  const parsed = posts?.result?.map((obj) => obj);
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
    <></>
  )
};

export default Posts;