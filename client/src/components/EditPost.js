import "./EditPost.css";
import Upload from "./Upload";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { editPost, selectNewPostImg } from  "../reducers/post";

const RedactPost = (props) => {
  const dispatch = useDispatch();
  const imgPreload = useSelector(selectNewPostImg);
  const [title, setTitle] = useState(props.title);
  const [enabled, setEnable] = useState(false);
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    if(document.getElementById('label-file-upload')?.style?.backgroundImage?.length !== 0 ){
      if(imgPreload!== 0) {
        (title!== '' && !pressed) ? setEnable(true) : setEnable(false);
      } else { (title !== '' && title!== props.title && !pressed) ? setEnable(true) : setEnable(false); } 
    } else setEnable(false);  },[title, props.title, imgPreload, pressed]);
  const postEdit = async (query,id) => {
    if(title !== props.title) {
      const res = await fetch(`http://localhost:8080/post/${id}`, {method: 'PUT', headers: {'Content-Type':'application/json'}, body: query});
      const json = await res.json();
      json.success && (imgPreload !== 0) ? 
      postImg('http://localhost:8080/post/'+JSON.stringify(json.result.id)+'/picture', document.getElementById('input-file-upload').files[0]) 
      :
      ((json.result = { ...json.result, event: 'editPostPanel'}) && dispatch(editPost(json.result)));
    } else {
      postImg('http://localhost:8080/post/'+JSON.stringify(props.id)+'/picture', document.getElementById('input-file-upload').files[0]);
    }
  };
  const postImg = async (url, query) => {
    const formData = new FormData();
    formData.append("picture", query);
    const res = await fetch(url, {method: 'POST', headers: {'Accept': '/'}, body: formData});
    const json = await res.json();
    if(json.success) {
      json.result = { ...json.result, event: 'editPostPanel'};
      dispatch(editPost(json.result));
    } 
  };
  const handleEditPost = (e) => {
    setEnable(false);
    setPressed(true);
    e.preventDefault();
    postEdit(JSON.stringify({title: title}), props.id);
  };
   return (
    <div  className="EditPost">
      <input autoFocus name="input_title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
      <Upload preload={true} url={props.url}/>
    <div className="EditPost">
      <button disabled={!enabled} onClick={(e) => handleEditPost(e)}>Edit post</button>
      <button className="cancel_button" onClick={() => {dispatch(editPost({event: "editPostPanelHide"})) }}>Cancel</button>
    </div>
    </div>
    );
};

export default RedactPost;