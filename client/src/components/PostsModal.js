import "./Posts.css";
import PostPanel from "./PostPanel";
import Modal from 'react-modal'
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { editPost } from "../reducers/post";


const PostsModal = (props) => {
  const modalEvent = props.modalEvent;
  const dispatch = useDispatch();

  return (
    <Modal onRequestClose={dispatch(editPost({event: 'hidePostModal'}))}isOpen={modalEvent.Event !== "hide"} className={`main-modal-${modalEvent.Event}`} appElement={document.getElementById('root') || undefined}>
    {(() => {
      if (modalEvent.Event === "fullscreen") {
        return (
          <div>
            {modalEvent.payload.date} <br />
            {modalEvent.payload.title} by {modalEvent.payload.owner}
            <img onClick={e => e.currentTarget === e.target } alt={modalEvent.payload.title} className={`main-modal-${modalEvent.Event}-img`} src={modalEvent.payload.url}></img>
            <div className="posts-panel-modal"><PostPanel id={modalEvent.id} title={modalEvent.payload.title} owner={modalEvent.payload.owner} url={modalEvent.payload.url} likes={modalEvent.payload.likes} dislikes={modalEvent.payload.dislikes} date={modalEvent.payload.date} comments={modalEvent.payload.comments} /></div>
          </div>
        )
      }
    })()}
  </ Modal>
  )
}

export default PostsModal;