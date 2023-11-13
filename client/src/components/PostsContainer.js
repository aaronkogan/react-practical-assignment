import Posts from "./Posts";
import timeConverter from "../utils/TimeConverter";
import  { lastPageFetch, fetchPosts }  from "../services/Api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { selectPosts, getPosts, totalPages, selectPages ,selectSearchQuery, selectPage, selectPostsUpdate, updatePosts, searchQuery, currentPage, resetPosts } from "../reducers/posts";
import { selectPostQuery, resetPostEvent, editPost } from "../reducers/post";

const PostsContainer = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const postQuery = useSelector(selectPostQuery);
  const postsUpdate = useSelector(selectPostsUpdate);
  const page = useSelector(selectPage);
  const pagesCount = useSelector(selectPages);
  const search = useSelector(selectSearchQuery);
  const parsed = posts?.result?.map((obj) => obj);
  const [parseResult, setParseResult] = useState([]);
  const getlastPage = useCallback(async () => {
    const json = await lastPageFetch();
    json.success && dispatch(totalPages(json.totalPages)); dispatch(currentPage(json.page)); dispatch(getPosts(json)); dispatch(updatePosts(true));
  },[dispatch]);
  const pagePosts = useCallback(async (query) => {
    const json = await fetchPosts(query);
    json.success && dispatch(totalPages(json.totalPages)); (pagesCount < currentPage) ? (dispatch(currentPage(pagesCount))) : (dispatch(currentPage(json.page)));
    dispatch(getPosts(json)); dispatch(updatePosts(true));
  },[dispatch, pagesCount]);
  const parsedProcess = useCallback(() => { 
    const parsedProcess = [];
    for (var i = 0; i < parsed.length; i++) { if (parsed[i] !== '') {
        parsedProcess.push([parsed[i].id, parsed[i].title, parsed[i].username, parsed[i].imageSrc, parsed[i].likes, parsed[i].dislikes, timeConverter(parsed[i].date), parsed[i].comments]) 
      }}
    parsedProcess.reverse(); setParseResult(parsedProcess);
  },[parsed]);
  useEffect(() => {
      if (postQuery?.event === 'firstStart') { dispatch(resetPostEvent()); getlastPage(); }
      if (postQuery?.event === 'newPost') {
        const request = JSON.parse(JSON.stringify(postQuery)); 
        delete request["event"];
        if (parsed?.length < 9) {
          parsed?.push(request);
          if (search === '') {
            dispatch(resetPostEvent()); dispatch(currentPage(pagesCount)); dispatch(getPosts({ result: parsed })); dispatch(updatePosts(true));
          } else {
            document.getElementById('search').value = ""; dispatch(searchQuery("")); dispatch(resetPostEvent()); getlastPage();
          }
        } else {
          document.getElementById('search').value = ""; dispatch(searchQuery("")); dispatch(resetPostEvent()); getlastPage();
        }
      }
      if (postQuery?.event === 'editPost') {
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        for (let j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === postQuery.id) {
            request.comments = parsed[j].comments;
            parsed[j] = request;
            dispatch(resetPostEvent()); dispatch(getPosts({ result: parsed })); dispatch(updatePosts(true));
            dispatch(editPost({event: 'updatePostsModal', payload: { id: parsed[j].id, title: parsed[j].title, owner: parsed[j].username, url: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: timeConverter(parsed[j].date), comments: parsed[j].comments }})); 
            break;
          }
        }
      }
      if (postQuery?.event === 'deletePost') {
        if (parsed?.length > 1) {
          if (search === '') { 
            dispatch(resetPostEvent()); pagePosts(page); 
          } else {
            document.getElementById('search').value = ""; dispatch(searchQuery("")); dispatch(resetPostEvent()); getlastPage();
          }
        } else {
          document.getElementById('search').value = ""; dispatch(searchQuery("")); dispatch(resetPostEvent()); dispatch(resetPosts()); getlastPage();
        }
        dispatch(editPost({event: 'hidePostsModal'}))
      }
      if (postQuery?.event === 'editPostLike') {
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        for (let j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === postQuery.id) {
            request.comments = parsed[j].comments;
            parsed[j] = request;
            dispatch(resetPostEvent()); dispatch(getPosts({ result: parsed })); dispatch(updatePosts(true));
            break;
          }
        }
      }
      if (postQuery?.event === 'editPostDislike') {
        const request = JSON.parse(JSON.stringify(postQuery));
        delete request["event"];
        for (let j = 0; j < parsed?.length; j++) {
          if (parsed[j].id === postQuery.id) {
            request.comments = parsed[j].comments;
            parsed[j] = request;
            dispatch(resetPostEvent()); dispatch(getPosts({ result: parsed })); dispatch(updatePosts(true));
            break;
          }
        }
      }
    if (postsUpdate) { parsedProcess(); dispatch(updatePosts(false)); }
  },[dispatch, parsed, getlastPage, page, pagePosts, pagesCount, postQuery, search, posts, parsedProcess, postsUpdate]);

  return ( <Posts parseResult={parseResult} posts={posts} /> );
}

export default PostsContainer;