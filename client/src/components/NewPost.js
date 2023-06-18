import "./NewPost.css";
import React, { useState } from "react";
import {useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { newPost, selectPosts } from "../reducers/posts";

const AddPost = () => {
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
      console.log('##5555'+query);
      };
    const handleNewPost = (e) => {
        e.preventDefault();
        postComment(url,JSON.stringify({title:'ss', username:'ssd', imageSrc:'ssss'}));
      };
    return (
        <div className="NewPost">
            <button onClick={(e) => handleNewPost(e)}>Add post</button>
        </div>
      );
};

export default AddPost;