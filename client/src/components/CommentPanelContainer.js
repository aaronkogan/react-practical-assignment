import  CommentPanel  from './CommentPanel'
import { selectCommentsQuery, editComment } from "../reducers/comments";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';

const CommentPanelContainer = (props) => {
  const dispatch = useDispatch();
  const commentsQuery = useSelector(selectCommentsQuery);
  const [likes, setLikes] = useState([...props?.likes]);
  const [dislikes, setDislikes] = useState([...props?.dislikes]);
  useEffect(() => {
    if ((commentsQuery.event === 'editCommentDislikeRate' && commentsQuery.id === props.id) || (commentsQuery.event === 'editCommentLikeRate' && commentsQuery.id === props.id)) {
      const json = JSON.parse(JSON.stringify(commentsQuery));
      delete json['event'];
      json.event = String(commentsQuery.event).slice(0, -4) + "Panel";
      dispatch(editComment(json));
      setLikes([...commentsQuery.likes]);
      setDislikes([...commentsQuery.dislikes]);
    }
  }, [commentsQuery, dispatch, props.id]);
  return (<CommentPanel comments={props.comments} owner={props.owner} text={props.text} likes={likes} dislikes={dislikes} postId={props.postId} id={props.id} url={props.url}/>)
}
export default CommentPanelContainer;