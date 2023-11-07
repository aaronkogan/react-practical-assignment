import "./EditPost.css";
import  { fetchEditPost, postImg }  from "../services/Api";
import Upload from "./Upload";
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { editPost, selectNewPostImg } from "../reducers/post";

const RedactPost = (props) => {
  const dispatch = useDispatch();
  const imgPreload = useSelector(selectNewPostImg);
  const [title, setTitle] = useState(props.title);
  const [enabled, setEnable] = useState(false);
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    if (document.getElementById('label-file-upload')?.style?.backgroundImage?.length !== 0) {
      if (imgPreload !== 0) {
        (title !== '' && !pressed) ? setEnable(true) : setEnable(false);
      } else { (title !== '' && title !== props.title && !pressed) ? setEnable(true) : setEnable(false); }
    } else setEnable(false);
  }, [title, props.title, imgPreload, pressed]);
  const sendImg = useCallback(async (postId) => {
    const json = await postImg(postId);
    if (json.success) {
      json.result = { ...json.result, event: 'editPostPanel' };
      dispatch(editPost(json.result));
    }
  },[dispatch]);
  const postEdit = useCallback(async (query, id) => {
    if (title !== props.title) {
      const json = await fetchEditPost(query,id);
      json.success && (imgPreload !== 0) ?
      sendImg(JSON.stringify(json.result.id))
        :
        ((json.result = { ...json.result, event: 'editPostPanel' }) && dispatch(editPost(json.result)));
    } else {
      sendImg(JSON.stringify(props.id));
    }
  },[dispatch, imgPreload, props.id, props.title, sendImg, title]);
  const handleEditPost = useCallback(() => {
    setEnable(false);
    setPressed(true);
    postEdit(JSON.stringify({ title: title }), props.id);
  },[postEdit, props.id, title]);
  return (
    <div className="EditPost">
      <input autoFocus name="input_title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
      <Upload preload={true} url={props.url} />
      <div className="EditPost">
        <button disabled={!enabled} onClick={handleEditPost}>Edit post</button>
        <button className="cancel_button" onClick={() => { dispatch(editPost({ event: "editPostPanelHide" })) }}>Cancel</button>
      </div>
    </div>
  );
};

export default RedactPost;