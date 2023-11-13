import "./CommentPanel.css";
import  { fetchEditComment }  from "../services/Api";
import { selectUser } from '../reducers/user';
import  CommentPanelModal  from './CommentPanelModal'
import { deleteComment, selectCommentsQuery, editComment, resetCommentsEvent } from "../reducers/comments";
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";

const CommentPanel = (props) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const commentsQuery = useSelector(selectCommentsQuery);
  const [localEvent, setLocalEvent] = useState("hide");
  const isOwner = (user.name === props.owner);
  useEffect(() => {
  if (commentsQuery.event === 'hideCommentPanelModal') { dispatch(resetCommentsEvent()); setLocalEvent("hide") }
   if (commentsQuery.event === 'editCommentPanelModal') {
    const json = JSON.parse(JSON.stringify(commentsQuery));
    delete json['event'];
    json.event = 'editCommentPanel';
    dispatch(deleteComment(json)); setLocalEvent("hide");
   }
   if (commentsQuery.event === 'deleteCommentPanelModal') {
    const json = JSON.parse(JSON.stringify(commentsQuery));
    delete json['event'];
    json.event = 'deleteCommentPanel';
    dispatch(deleteComment(json)); setLocalEvent("hide");
   }
  },[dispatch, commentsQuery.event, commentsQuery]);
  const isInArray = useCallback((list) => {
    for (var j = 0; j < list.length; j++) { if (list[j] === user.name) return true }
    return false;
  },[user.name]);
  const commentEditLike = useCallback(async (query, id) => {
    const json = await fetchEditComment(id, query);
    json.success && (json.result = { ...json.result, event: 'editCommentLikeRate' });
    dispatch(editComment(json.result));
  },[dispatch])
  const commentEditDislike = useCallback(async (query, id) => {
    const json = await fetchEditComment(id, query);
    json.success && (json.result = { ...json.result, event: 'editCommentDislikeRate' });
    dispatch(editComment(json.result));
  },[dispatch])
  const like  = useCallback(() => { (props.dislikes.indexOf(user.name) > -1) && props.dislikes.splice(props.dislikes.indexOf(user.name), 1);
    commentEditLike(JSON.stringify({ id: props.id, postId: props.postId, username: props.owner, likes: [...props.likes, user.name], dislikes: [...props.dislikes] }), props.id);
  },[user.name, props.likes, props.dislikes, props.postId, props.id, props.owner, commentEditLike]);
  const dislike = useCallback(() => { (props.likes.indexOf(user.name) > -1) && props.likes.splice(props.likes.indexOf(user.name), 1);
    commentEditDislike(JSON.stringify({ id: props.id, postId: props.postId, usename: props.owner, likes: [...props.likes], dislikes: [...props.dislikes, user.name] }), props.id);
  },[user.name, props.likes, props.dislikes, commentEditDislike, props.id, props.owner, props.postId]);
  return ( 
  <div className="panelCommentsContainer">{isOwner ?
    <div className="panelComments">
      <button onClick={e => e.currentTarget === e.target && setLocalEvent("edit")} title="Edit comment">&#9997;</button>
      <button onClick={e => e.currentTarget === e.target && setLocalEvent("delete")} title="Delete comment">&#128465;</button>
      <button onClick={e => e.currentTarget === e.target && like()} disabled={isInArray(props.likes)} title="Like">&#128077;{(props.likes.length > 0 && props.likes[0] !== undefined) && <small onClick={e => e.currentTarget === e.target && like()} className="like"> {props.likes?.length}</small>}</button>
      <button onClick={e => e.currentTarget === e.target && dislike()} disabled={isInArray(props.dislikes)} title="Dislike">&#128078;{(props.dislikes.length > 0 && props.dislikes[0] !== undefined) && <small onClick={e => e.currentTarget === e.target && dislike()} disabled={isInArray(props.dislikes)}  className="dislike"> {props.dislikes?.length}</small>}</button>
    </div>
    :
    <div className="panelComments">
      <button onClick={e => e.currentTarget === e.target && like()} disabled={isInArray(props.likes)} title="Like">&#128077;{(props.likes.length > 0 && props.likes[0] !== undefined) && <small onClick={e => e.currentTarget === e.target && like()} disabled={isInArray(props.likes)} className="like"> {props.likes?.length}</small>}</button>
      <button onClick={e => e.currentTarget === e.target && dislike()} disabled={isInArray(props.dislikes)} title="Dislike">&#128078;{(props.dislikes.length > 0 && props.dislikes[0] !== undefined) && <small onClick={e => e.currentTarget === e.target && dislike()} disabled={isInArray(props.dislikes)} className="dislike"> {props.dislikes?.length}</small>}</button>
    </div>
  }
  <CommentPanelModal user={user} url={props.url} postId={props.postId} id={props.id} localEvent={localEvent} comments={props.comments} text={props.text}/>
  </div>   
  ) 
}

export default CommentPanel;