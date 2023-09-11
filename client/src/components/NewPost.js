import "./NewPost.css";
import React, {useState} from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from "react-redux";
import { newPost, selectPosts } from "../reducers/posts";

const AddPost = () => {
  const [modalIsOpen,setModalIsOpen] = useState(false);
  const setModalIsOpenToTrue =()=>{
      setModalIsOpen(true)
  }
  const setModalIsOpenToFalse =()=>{
      setModalIsOpen(false)
  }
    const url = ('http://localhost:8080/post/')
    const dispatch = useDispatch();
    const postComment = async (url, query, cb) => {
      console.warn('fetching ' + url);
      const res = await fetch(url, {method: 'POST', headers: {'Content-Type':'application/json'}, body: query});
      fetchPosts('http://localhost:8080/post/');
    };
    const fetchPosts = async (query) => {
      console.warn('fetching ' + query);
      const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
      const json = await res.json();
      dispatch(newPost(json));
      };
    const handleNewPost = (e) => {
        e.preventDefault();
        postComment(url,JSON.stringify({title:'ss', username:'ssd', imageSrc:''}));
      };
    return (
      <React.Fragment>
        <div className="NewPost">
            <button onClick={setModalIsOpenToTrue}>New post</button>
            <Modal onRequestClose={setModalIsOpenToFalse} isOpen={modalIsOpen} className="newPostModal">
                <ul>
                <input placeholder="Title" type="text"></input>
                 <h1>Fullmetal Alchemist: Brotherhood</h1>
                 <h1>Naruto</h1>
                 <h1>Bleach</h1>
                 <h1>Haikyu!!</h1>
                 <h1>Kuroko no Basketball</h1>
                 <h1>My hero academia</h1>
                 <h1>One punch man</h1>   
            </ul> 
            <div className="NewPost">
            <button  onClick={(e) => handleNewPost(e)}>Add post</button>
            </div>
            <button onClick={setModalIsOpenToFalse}>Cancel</button>
            </Modal>

            </div>
      </React.Fragment>
      );
};

export default AddPost;