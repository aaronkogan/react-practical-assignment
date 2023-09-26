import "./EditPost.css";
import Upload from "./Upload";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { editPost, preloadPostImg, selectNewPostImg } from  "../reducers/post";
import { selectUser } from '../reducers/user';
const RedactPost = (props) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const imgPreload = useSelector(selectNewPostImg);
  const [title, setTitle] = useState(props.title);
  const [enabled, setEnable] = useState(false);
    useEffect(() => {
      if(document.getElementById('label-file-upload')?.style?.backgroundImage?.length !== 0){
        if(imgPreload!== 0) {
          (title!== '') ? setEnable(true) : setEnable(false);
        } else { (title !== '' && title!== props.title) ? setEnable(true) : setEnable(false); } 
     } else setEnable(false);  },[title, props.title, imgPreload]);
    const postEdit = async (query,id) => {
      const res = await fetch(`http://localhost:8080/post/${id}`, {method: 'PUT', headers: {'Content-Type':'application/json'}, body: query});
      const json = await res.json();
      json.success && (imgPreload !== 0) ? postImg('http://localhost:8080/post/'+JSON.stringify(json.result.id)+'/picture', document.getElementById('input-file-upload').files[0]) : json.result = { ...json.result, event: 'editPost'};
      dispatch(editPost(json.result));
    };
    const postImg = async (url, query) => {
      const formData = new FormData();
      formData.append("picture", query);
      const res = await fetch(url, {method: 'POST', headers: {'Accept': '/'}, body: formData});
      const json = await res.json();
      if(json.success) {
        json.result = { ...json.result, event: 'editPost'};
        dispatch(editPost(json.result));
      } 
    };
  const handleEditPost = (e) => {
      e.preventDefault();
      postEdit(JSON.stringify({title: title}), props.id);
    };
   return (
    <div  className="EditPost">
      <input autoFocus name="input_title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
      <Upload preload={true} url={props.url}/>
    <div className="EditPost">
      <button disabled={!enabled} onClick={(e) => handleEditPost(e)}>Edit post</button>
      <button className="cancel_button" onClick={() => { console.warn("DEBUG: "+ document.getElementById('label-file-upload')?.style?.backgroundImage?.length) }}>Cancel</button>
    </div>
    </div>
    );
};

export default RedactPost;