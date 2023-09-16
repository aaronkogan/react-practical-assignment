import "./NewPost.css";
import "./DragDrop.css";
import React, { useState, useEffect, useRef} from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../reducers/posts";
import { selectUser } from '../reducers/user';

const AddPost = () => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imagesURLs, setImageURLs] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [title, setTitle] = useState("");
  const [modalIsOpen,setModalIsOpen] = useState(false);
  const setModalIsOpenToTrue =()=>{
      setModalIsOpen(true)
  }
  const setModalIsOpenToFalse =()=>{
      setModalIsOpen(false);
      setTitle("");
      images[0] = undefined;
      imagesURLs[0] = undefined;
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
    json.success && postImg('http://localhost:8080/post/'+JSON.stringify(json.result.id)+'/picture', images[0]);
  };
  const fetchPosts = async (query) => {
    console.warn('fetching ' + query);
    const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
    const json = await res.json();
    dispatch(getPosts(json));
    setModalIsOpenToFalse();
    };
  const handleNewPost = (e) => {
      e.preventDefault();
      postInit(JSON.stringify({title: title, username: user.name}));
    };
  //Drag drop events
  useEffect(() => {
    if (images.length<1) return;
    const newImageURLs = [];
    images.forEach(image => newImageURLs.push(URL.createObjectURL(image)));
    setImageURLs(newImageURLs);
  }, [images]);
  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImages([...e.dataTransfer.files]);
    }
  };
  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setImages([...e.target.files]);
    }
  };
  const onButtonUploadClick = () => {
    inputRef.current.click();
  };
  const enabled = (title.length > 0 && images[0]!== undefined);
  return (
    <React.Fragment>
      <div className="NewPost">
          <button onClick={setModalIsOpenToTrue}>New post</button>
          <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalIsOpen} className="newPostModal" appElement={document.getElementById('root') || undefined}>
              <input className="input_title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
              <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <input ref={inputRef} type="file" id="input-file-upload" accept="image/*" multiple={false} onChange={handleChange} />
                <label style={{ backgroundImage: `url(${imagesURLs[0]})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}} id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
                { !imagesURLs[0] && 
                  <div>
                    <p>Drag and drop your photo here</p>
                    <button className="upload-button" onClick={onButtonUploadClick}>or click to select file</button>
                  </div> 
                }
                </label>
                { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
              </form>
      <div className="NewPost">
          <button disabled={!enabled} onClick={(e) => handleNewPost(e)}>Add post</button>
          <button className="cancel_button" onClick={setModalIsOpenToFalse}>Cancel</button>
      </div>
          </Modal>
      </div>
    </React.Fragment>
    );
};

export default AddPost;