import "./Comments.css";
import  CommentsModal  from './CommentsModal'
import CommentPanel from "./CommentPanel";
import { selectUser } from '../reducers/user';
import timeConverter from "../utils/TimeConverter";
import { selectCommentsQuery, newComment, deleteComment, editComment, resetCommentsEvent } from "../reducers/comments";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback } from 'react';

const CommentsContainer = (props) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const commentsQuery = useSelector(selectCommentsQuery);
  const [comments, setComments] = useState([...props.comments]);
  const [showComments, setShowComments] = useState(false);
  const [localEvent, setLocalEvent] = useState("hide");
  const handleShowComments = useCallback(() => { (!showComments) ? setLocalEvent("showComments") : setLocalEvent("hideComments")  },[showComments]);
  const handleClickNewComment = useCallback(() => { (setLocalEvent("newCommentModal")) && setShowComments(false) },[]);
  useEffect(() => {
    (commentsQuery.event === 'hideNewCommentsModal') && (dispatch(resetCommentsEvent())) && setLocalEvent("hide") ; 
    if (commentsQuery.event === 'addCommentPanel' && commentsQuery.postId === props.id) {
      const json = JSON.parse(JSON.stringify(commentsQuery));
      delete json['event'];
      json.event = 'addComment';
      setComments([...comments, json]);
      dispatch(newComment(json));
      setLocalEvent("hide");
    }
    const commentsMap = [];
    if (commentsQuery.event === 'deleteCommentPanel') { comments.map((comments) => ((comments.id !== commentsQuery.id) && commentsMap.push(comments)))
      setComments([...commentsMap]);
      dispatch(deleteComment({ postId: props.id, comments: [...commentsMap], event: 'deleteComment' }));
      commentsMap.length === 0 && setLocalEvent("hideComments");
    }
    var j = 0;
    if (commentsQuery.event === 'editCommentPanel' && commentsQuery.postId === props.id) {
      comments.map((comments) => (commentsMap.push(comments)))
      for (j = 0; j < commentsMap.length; j++) {
        if (commentsMap[j].id === commentsQuery.id) {
          commentsMap[j] = { id: commentsQuery.id, username: user.name, date: commentsQuery.date, likes: commentsQuery.likes, dislikes: commentsQuery.dislikes, text: commentsQuery.text };
        }
      }
      setComments(commentsMap);
      dispatch(editComment({ postId: props.id, comments: [...commentsMap], event: 'editComment' }));
    }
    if ((commentsQuery.event === 'editCommentLikePanel' && commentsQuery.postId === props.id) || (commentsQuery.event === 'editCommentDislikePanel' && commentsQuery.postId === props.id)) {
      comments.map((comment) => (commentsMap.push(comment)))
      for (j = 0; j < commentsMap.length; j++) {
        if (commentsMap[j].id === commentsQuery.id) {
          commentsMap[j] = { id: commentsQuery.id, postId: commentsQuery.postId, username: commentsQuery.username, date: commentsQuery.date, likes: commentsQuery.likes, dislikes: commentsQuery.dislikes, text: commentsQuery.text };
        }
      }
      setComments(commentsMap);
      dispatch(editComment({ postId: props.id, username: props.owner, comments: [...commentsMap], event: String(commentsQuery.event).slice(0, -5) }));
    }
    if (commentsQuery.event === 'hideComments') { setShowComments(false) && dispatch(resetCommentsEvent()) }
    if (localEvent === "showComments") { setShowComments(true) && setLocalEvent("hide") }
    if (localEvent === "hideComments") { setShowComments(false) && setLocalEvent("hide") }
  }, [localEvent, user.name, props.id, props.postId, props.owner, commentsQuery, dispatch, comments]);
  
  return (
    <>
    <button
      className={(showComments) ? "msg-pressed" : "msg-unpressed"}
      aria-pressed={false}
      onClick={e => e.currentTarget === e.target && handleShowComments()}
      disabled={(!comments?.length > 0)}
      title="Show comments">&#128172;
      <small onClick={e => e.currentTarget === e.target && handleShowComments()} > {(comments?.length > 0) && comments.length}</small>
    </button>
    <button
      onClick={e => e.currentTarget === e.target && handleClickNewComment()}
      title="New comment">&#128488;<small onClick={e => e.currentTarget === e.target && setLocalEvent("newCommentModal")} className="addComment">+</small>
    </button>
    <div className={(showComments) ? "wrapper" : "wrapper-hide"}>
      <div className="shape bubble">
        {comments.map((comment) => (
          <div className="msg-container wrapper " key={JSON.stringify(comment.id)}>
            <div className="msg">
              <div>{comment.username} {timeConverter(comment.date)}</div>
              <CommentPanel postId={props.id} user={user} id={comment.id} likes={comment.likes} dislikes={comment.dislikes} title={props.title} owner={comment.username} url={props.url} date={comment.date} comments={props.comments} text={comment.text} />
              <textarea className="msgText" value={comment.text} readOnly />
            </div>
          </div>
        ))}
      </div>
    </div>
    <CommentsModal localEvent={localEvent} postId={props.id} user={user} />
  </>
  )
  }

export default CommentsContainer;