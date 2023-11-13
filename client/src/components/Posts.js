import "./Posts.css";
import isTouchScreenDevice from "../utils/TouchScreenDetect";
import Pagination from "./Pagination";
import PostPanel from "./PostPanel";
import PostsModal from "./PostsModal";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getPosts, updatePosts, selectPages, } from "../reducers/posts";
import { editPost } from "../reducers/post";
import { selectCommentsQuery, resetCommentsEvent } from "../reducers/comments";

const Posts = (props) => {
  const dispatch = useDispatch();
  const commentsQuery = useSelector(selectCommentsQuery);
  const pagesCount = useSelector(selectPages);
  const [hoverId, setHoverId] = useState(0);
  useEffect(() => {
    const parsed = props.posts?.result?.map((obj) => obj);
    if (commentsQuery.event === 'addComment') {
      const request = JSON.parse(JSON.stringify(commentsQuery));
      delete request["event"];
      for (let j = 0; j < parsed?.length; j++) {
        if (parsed[j].id === commentsQuery.postId) {
          parsed[j] = { id: parsed[j].id, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...parsed[j].comments, request] }
          dispatch(resetCommentsEvent()); dispatch(getPosts({ result: parsed })); dispatch(updatePosts(true)); 
          break;
        }
      }
    } else if (commentsQuery.event === 'editComment') {
      const request = JSON.parse(JSON.stringify(commentsQuery));
      delete request["event"];
      for (let j = 0; j < parsed?.length; j++) {
        if (parsed[j].id === commentsQuery.postId) {
          parsed[j] = { id: parsed[j].id, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...request.comments] };
          dispatch(resetCommentsEvent()); dispatch(getPosts({ result: parsed })); dispatch(updatePosts(true));
          dispatch(editPost({event: 'hidePostModal'}))
          break;
        }
      }
    } else if (commentsQuery.event === 'editCommentLike') {
      const request = JSON.parse(JSON.stringify(commentsQuery));
      delete request["event"];
      for (let j = 0; j < parsed?.length; j++) {
        if (parsed[j].id === commentsQuery.postId) {
          parsed[j] = { id: commentsQuery.postId, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...request.comments] };
          dispatch(resetCommentsEvent()); dispatch(getPosts({ result: parsed })); dispatch(updatePosts(true));
          break;
        }
      }
    } else if (commentsQuery.event === 'editCommentDislike') {
      const request = JSON.parse(JSON.stringify(commentsQuery));
      delete request["event"];
      for (let j = 0; j < parsed?.length; j++) {
        if (parsed[j].id === commentsQuery.postId) {
          parsed[j] = { id: commentsQuery.postId, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...request.comments] };      
          dispatch(resetCommentsEvent()); dispatch(getPosts({ result: parsed })); dispatch(updatePosts(true));
          break;    
        }
      }
    } else if (commentsQuery.event === 'deleteComment') {
      for (let j = 0; j < parsed?.length; j++) {
        if (parsed[j].id === commentsQuery.postId) {
          parsed[j] = { id: commentsQuery.postId, title: parsed[j].title, username: parsed[j].username, imageSrc: parsed[j].imageSrc, likes: parsed[j].likes, dislikes: parsed[j].dislikes, date: parsed[j].date, comments: [...commentsQuery?.comments] }; 
          dispatch(resetCommentsEvent()); dispatch(getPosts({ result: parsed })); dispatch(updatePosts(true));
          break;
        }
      }
    }
  }, [commentsQuery, dispatch, props.parseResult, props.posts?.result]);

  return (
    <div>
      <div className="posts-container">
        {props.parseResult.map((post) => (
          <div
            className="posts-item"
            onMouseEnter={() => setHoverId(post[0])}
            onClick={e => e.currentTarget === e.target && dispatch(editPost({event: 'showPostsModal', payload: { id: post[0], title: post[1], owner: post[2], url: post[3], likes: post[4], dislikes: post[5], date: post[6], comments: post[7] }}))}
            style={{ backgroundImage: `url(${post[3]})` }}
            key={post[0]}>{(hoverId === post[0] || isTouchScreenDevice()) &&
              <div>
                <div onClick={e => e.currentTarget === e.target && dispatch(editPost({event: 'showPostsModal', payload: { id: post[0], title: post[1], owner: post[2], url: post[3], likes: post[4], dislikes: post[5], date: post[6], comments: post[7] }}))}>
                    {post[6]}<br />{post[1]} by {post[2]}
                </div>
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
       <PostsModal />
    </div>
  )
};

export default Posts;