import "./NewPost.css";
import Upload from "./Upload";
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from "react-redux";
import { getPosts, preloadPostImg, selectNewPostImg } from "../reducers/posts";
import { selectUser } from '../reducers/user';

const EditPost = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const imgPreload = useSelector(selectNewPostImg);
  const [title, setTitle] = useState("");
  const [modalIsOpen,setModalIsOpen] = useState(false);
  const setModalIsOpenToTrue =()=>{
      setModalIsOpen(true)
  }
  const setModalIsOpenToFalse =()=>{
      setModalIsOpen(false);
      setTitle("");
      dispatch(preloadPostImg(0));
  }
  const postImg = async (url, query, cb) => {
    const formData = new FormData();
    formData.append("picture", query);
    const res = await fetch(url, {method: 'POST', headers: {'Accept': '/'}, body: formData});
    const json = await res.json();
    json.success && fetchPosts('http://localhost:8080/post/');
  };
  const postInit = async (query, cb) => {
    const res = await fetch('http://localhost:8080/post/', {method: 'POST', headers: {'Content-Type':'application/json'}, body: query});
    const json = await res.json();
    json.success && postImg('http://localhost:8080/post/'+JSON.stringify(json.result.id)+'/picture', document.getElementById('input-file-upload').files[0]);
  };
  const fetchPosts = async (query) => {
    const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
    const json = await res.json();
    dispatch(getPosts(json));
    setModalIsOpenToFalse();
    };
  const handleNewPost = (e) => {
      e.preventDefault();
      postInit(JSON.stringify({title: title, username: user.name}));
    };
  const enabled = (title.length > 0 && imgPreload);
  return (
    <React.Fragment>
      <div className="NewPost">
          <button onClick={setModalIsOpenToTrue}>Edit post</button>
          <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalIsOpen} className="newPostModal" appElement={document.getElementById('root') || undefined}>
              <input className="input_title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
              <Upload />
      <div className="NewPost">
          <button disabled={!enabled} onClick={(e) => handleNewPost(e)}>Add post</button>
          <button className="cancel_button" onClick={setModalIsOpenToFalse}>Cancel</button>
      </div>
          </Modal>
      </div>
    </React.Fragment>
    );
};

export default EditPost;