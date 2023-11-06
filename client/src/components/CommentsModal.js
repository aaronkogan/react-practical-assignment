import "./Comments.css";
import  { addComment }  from "../services/Api";
import Modal from 'react-modal';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { newComment } from "../reducers/comments";

const CommentsModal = (props) => {
    const dispatch = useDispatch();
    const [enabled, setEnable] = useState(false);
    const [newCommentInput, setNewCommentInput] = useState("");
    useEffect(() => { (newCommentInput.length > 0) ? setEnable(true) : setEnable(false) },[newCommentInput.length]);
    const handleHideNewComment = useCallback(() => {
        setNewCommentInput("");
        setEnable(false);
        dispatch(newComment({event: 'hideNewCommentsModal'}))
      },[dispatch]);
    const postComment = useCallback(async (query) => {
        const json = await addComment(query);
        if (json.success) {
          json.result = { ...json.result, event: 'addCommentPanel' };
          dispatch(newComment(json.result)) && handleHideNewComment();
        }
      },[dispatch, handleHideNewComment]);
    const handleNewComment  = useCallback(() => {
        setEnable(false);
        postComment(JSON.stringify({ postId: props.postId, username: props.user.name, text: newCommentInput }));
        setNewCommentInput("");
      },[newCommentInput, postComment, props.postId, props.user.name]);

    return (
        <Modal
        onRequestClose={e => e.currentTarget === e.target && handleHideNewComment()}
        isOpen={props.localEvent !== "hide" && props.localEvent !== "showComments" && props.localEvent !== "hideComments" && props.localEvent !== "hideNewCommentsModal" && props.localEvent !== "addCommentPanel"}
        className="modal"
        appElement={document.getElementById('root') || undefined}>
        {(() => {
          if (props.localEvent === "newCommentModal") {
            return (
              <div>
                <div>New comment on post</div>
                {props.date}
                <div>{props.title} by {props.owner}</div>
                <img onClick={e => e.currentTarget === e.target && handleHideNewComment()} alt={props.title} className={`modal-img`} src={props.url}></img>
                <textarea id="comment-input" onChange={(e) => setNewCommentInput(e.target.value)} autoFocus className="textarea" />
                <div className="buttons_area">
                  <button className="add_button" onClick={e => e.currentTarget === e.target && handleNewComment()} disabled={!enabled}>Add comment</button>
                  <button onClick={e => e.currentTarget === e.target && handleHideNewComment()} className="cancel_button">Cancel</button>
                </div>
              </div>
            )
          }
        })()}
      </ Modal>
    )
}

export default CommentsModal;