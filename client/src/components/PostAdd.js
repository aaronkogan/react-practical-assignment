import "./PostAdd.css";
import Upload from "./Upload";
import { useState, Fragment } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from "react-redux";
import { newPost, preloadPostImg, selectNewPostImg } from  "../reducers/post";
import { hideCommentsEvent } from "../reducers/comments";
import { selectUser } from '../reducers/user';

const AddPost = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const imgPreload = useSelector(selectNewPostImg);
  const [title, setTitle] = useState("");
  const [modalIsOpen,setModalIsOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const setModalIsOpenToTrue =()=>{
    dispatch(hideCommentsEvent());
    setModalIsOpen(true)
  }
  const setModalIsOpenToFalse =()=>{
      setModalIsOpen(false);
      setTitle("");
      setPressed(false);
      dispatch(preloadPostImg(0));
  }
  const postInit = async (query) => {
    const res = await fetch('http://localhost:8080/post/', {method: 'POST', headers: {'Content-Type':'application/json'}, body: query});
    const json = await res.json();
    json.success && postImg('http://localhost:8080/post/'+JSON.stringify(json.result.id)+'/picture', document.getElementById('input-file-upload').files[0]);
  };
  const postImg = async (url, query) => {
    const formData = new FormData();
    formData.append("picture", query);
    const res = await fetch(url, {method: 'POST', headers: {'Accept': '/'}, body: formData});
    const json = await res.json();
    if(json.success) {
      json.result = { ...json.result, event: 'newPost'};
      dispatch(newPost(json.result));
      setModalIsOpenToFalse();
    } 
  };
  const handleNewPost = (e) => {
    setPressed(true);
    e.preventDefault();
    postInit(JSON.stringify({title: title, username: user.name}));
  };
  const enabled = (title.length > 0 && imgPreload && !pressed);
  return (
    <Fragment>
      <div className="NewPost">
          <button onClick={setModalIsOpenToTrue}>New post</button>
          <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalIsOpen} className="newPostModal" appElement={document.getElementById('root') || undefined}>
              <input autoFocus name="input_title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
              <Upload preload={false}/>
      <div className="NewPost">
          <button disabled={!enabled} onClick={(e) => handleNewPost(e)}>Add post</button>
          <button className="cancel_button" onClick={setModalIsOpenToFalse}>Cancel</button>
      </div>
          </Modal>
      </div>
    </Fragment>
    );
};

export default AddPost;