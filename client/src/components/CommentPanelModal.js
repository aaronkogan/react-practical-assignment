import "./CommentPanel.css";
import  { delComment, fetchEditComment }  from "../services/Api";
import Modal from 'react-modal';
import { useState, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { deleteComment, editComment } from "../reducers/comments";

export default function CommentPanelModal(props){
  const dispatch = useDispatch();
  const [comment, setComment] = useState(props.text);
  const commentEdit  = useCallback(async () => {
    const json = await fetchEditComment(props.id, JSON.stringify({ postId: props.postId, username: props.user.name, text: comment }));
    if (json.success) { json.result = { ...json.result, event: 'editCommentPanelModal' };
      dispatch(editComment(json.result));
    }
  },[comment, dispatch, props.id, props.postId, props.user.name]);
  const commentRemove = useCallback(async () => {
    const json = await delComment(props.id);
    if (json.success) { json.result = { ...json.result, event: 'deleteCommentPanelModal' };
      dispatch(deleteComment(json.result));
    }
  },[dispatch, props.id]);

  return (
    <Modal onRequestClose={e => e.currentTarget === e.target && dispatch(editComment({event: 'hideCommentPanelModal'}))} isOpen={props.localEvent !== "hide" && props.localEvent !== "modalHide" && props.localEvent !== "removeComfirm" } className="panelModal" appElement={document.getElementById('root') || undefined}>
    {(() => {
      if (props.localEvent === "delete") {
        return (
          <div className={`panelModal-${props.localEvent}`}>
            <div>You want to delete comment?</div><br />
            <div>{props.text}</div>
            <div><button onClick={e => e.currentTarget === e.target && commentRemove()} className="delete-button">Delete</button>
              <button onClick={e => e.currentTarget === e.target && dispatch(deleteComment({event: 'hideCommentPanelModal'}))} className="cancel_button">Cancel</button></div></div>
        )
      } else if (props.localEvent === "edit") {
        return (
          <div className={`panelModal-${props.localEvent}`}>
            <div>
              <div>Edit comment on post</div>
              {props.date}
              <div>{props.title} by {props.owner}</div>
              <img className="panelModal-editComment-img" alt={props.title} src={props.url}></img>
              <textarea id="comment-input" onChange={(e) => setComment(e.target.value)} autoFocus defaultValue={comment} className="textarea" />
              <div className="buttons_area">
                <button onClick={e => e.currentTarget === e.target && commentEdit()} disabled={!(comment !== props.text && comment !== '')} className="add_button" >Edit comment</button>
                <button onClick={e => e.currentTarget === e.target && dispatch(editComment({event: 'hideCommentPanelModal'}))} className="cancel_button">Cancel</button>
              </div>
            </div>
          </div>
        )
      }
    })()}
  </ Modal>
  )
}