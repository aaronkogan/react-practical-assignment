import "./Posts.css";
import PostPanel from "./PostPanel";
import Modal from 'react-modal'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { editPost, selectPostQuery, resetPostEvent } from "../reducers/post";
import { hideCommentsEvent } from "../reducers/comments";


const PostsModal = () => {
  const dispatch = useDispatch();
  const postQuery = useSelector(selectPostQuery);
  const [modalShow, setModalShow] = useState(false);
  const [modalEvent, setModalEvent] = useState({});
  useEffect(() => {
    if (postQuery.event === "showPostsModal") { dispatch(hideCommentsEvent()); setModalEvent(postQuery); dispatch(resetPostEvent()); setModalShow(true);}
    if (postQuery.event === "hidePostsModal") { dispatch(resetPostEvent()); setModalShow(false); }
    if (postQuery.event === "updatePostsModal") { setModalEvent(postQuery); dispatch(resetPostEvent()); }
  }, [modalEvent, postQuery, dispatch]);
  return (
    <Modal isOpen={modalShow} onRequestClose={e => e.currentTarget === e.target && dispatch(editPost({event: 'hidePostsModal'}))} className={`main-modal`} appElement={document.getElementById('root') || undefined}>
          <div>
            {modalEvent.payload?.date} <br />
            {modalEvent.payload?.title} by {modalEvent.payload?.owner}
            <img onClick={e => e.currentTarget === e.target } alt={modalEvent.payload?.title} className={`main-modal-img`} src={modalEvent.payload?.url}></img>
            <div className="posts-panel-modal"><PostPanel id={modalEvent.payload?.id} title={modalEvent.payload?.title} owner={modalEvent.payload?.owner} url={modalEvent.payload?.url} likes={modalEvent.payload?.likes} dislikes={modalEvent.payload?.dislikes} date={modalEvent.payload?.date} comments={modalEvent.payload?.comments} /></div>
          </div>
  </ Modal>
  )
}

export default PostsModal;