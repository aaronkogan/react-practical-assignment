import "./PostAdd.css";
import  { postInit }  from "../services/Api";
import Upload from "./Upload";
import { useState, Fragment, useCallback } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from "react-redux";
import { newPost, preloadPostImg, selectNewPostImg } from "../reducers/post";
import { hideCommentsEvent } from "../reducers/comments";
import { selectUser } from '../reducers/user';

const AddPost = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const imgPreload = useSelector(selectNewPostImg);
  const [title, setTitle] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const setModalIsOpenToTrue = useCallback(() => {
    dispatch(hideCommentsEvent());
    setModalIsOpen(true)
  },[dispatch]);
  const setModalIsOpenToFalse = useCallback(() => {
    setModalIsOpen(false);
    setTitle("");
    setPressed(false);
    dispatch(preloadPostImg(0));
  },[dispatch]);
  const createPost = useCallback(async (query) => {
    const json = await postInit(query);
    if (json.success) {
      json.result = { ...json.result, event: 'newPost' };
      dispatch(newPost(json.result));
      setModalIsOpenToFalse();
    }  
  },[dispatch, setModalIsOpenToFalse]);
  const handleNewPost = useCallback(() => {
    setPressed(true);
    createPost(JSON.stringify({ title: title, username: user.name }));
  },[createPost, title, user.name]);
  const enabled = (title.length > 0 && imgPreload && !pressed);
  return (
    <Fragment>
      <div className="NewPost">
        <button onClick={setModalIsOpenToTrue}>New post</button>
        <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalIsOpen} className="newPostModal" appElement={document.getElementById('root') || undefined}>
          <input autoFocus name="input_title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
          <Upload preload={false} />
          <div className="NewPost">
            <button disabled={!enabled} onClick={handleNewPost}>Add post</button>
            <button className="cancel_button" onClick={setModalIsOpenToFalse}>Cancel</button>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
};

export default AddPost;