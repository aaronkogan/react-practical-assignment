import "./PostRate.css";
import { selectUser } from '../reducers/user';
import  { fetchEditPost }  from "../services/Api";
import { editPost, selectPostQuery } from "../reducers/post";
import { hideCommentsEvent } from "../reducers/comments";
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";

const PostRate = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const postQuery = useSelector(selectPostQuery);
    const [localEvent, setLocalEvent] = useState("default");
    const [likes, setLikes] = useState([...props?.likes]);
    const [dislikes, setDislikes] = useState([...props?.dislikes]);
    useEffect(() => {
        if ((postQuery.event === 'editPostDislikeRate' && postQuery.id === props.id) || (postQuery.event === 'editPostLikeRate' && postQuery.id === props.id)) {
            dispatch(hideCommentsEvent());
            const json = JSON.parse(JSON.stringify(postQuery));
            json['event'] = String(postQuery.event).slice(0, -4);
            dispatch(editPost(json));
            setLikes([...postQuery.likes]);
            setDislikes([...postQuery.dislikes]);
        }
        const postEditLike = async (query, id) => {
            const json = await fetchEditPost(query, id);
            json.success && ((json.result = { ...json.result, event: 'editPostLikeRate' }) && dispatch(editPost(json.result))) && setLocalEvent("default");
        }
        const postEditDislike = async (query, id) => {
            const json = await fetchEditPost(query, id);
            json.success && ((json.result = { ...json.result, event: 'editPostDislikeRate' }) && dispatch(editPost(json.result))) && setLocalEvent("default");
        }
        (localEvent === "like") && postEditLike(JSON.stringify({ id: props.id, usename: props.username, title: props.title, likes: [...likes], dislikes: [...dislikes] }), props.id);
        (localEvent === "dislike") && postEditDislike(JSON.stringify({ id: props.id, usename: props.username, title: props.title, likes: [...likes], dislikes: [...dislikes] }), props.id);
        setLocalEvent("default");
    }, [likes, dislikes, dispatch, props.id, props.title, localEvent, props.username, postQuery]);
    const isInArray = useCallback((list) => {
        for (var j = 0; j < list.length; j++) {
            if (list[j] === user.name) return true;
        }
        return false;
    },[user.name]);
    const like = useCallback(() => {
        if (dislikes.indexOf(user.name) > -1) {
            dislikes.splice(dislikes.indexOf(user.name), 1)
        }
        setLikes([...likes, user.name]);
        setLocalEvent("like");
    },[dislikes, likes, user.name]);
    const dislike = useCallback(() => {
        if (likes.indexOf(user.name) > -1) {
            likes.splice(likes.indexOf(user.name), 1)
        }
        setDislikes([...dislikes, user.name]);
        setLocalEvent("dislike");
    },[dislikes, likes, user.name]);
    return (
        <>
            <button
                onClick={like}
                disabled={isInArray(likes)}
                title="Like">&#128077;{(likes.length > 0 && likes[0] !== undefined) && <small className='like'> {likes?.length}</small>}
            </button>
            <button
                onClick={dislike}
                disabled={isInArray(dislikes)}
                title="Dislike">&#128078;{(dislikes.length > 0 && dislikes[0] !== undefined) && <small className='dislike'> {dislikes?.length}</small>}
            </button>
        </>
    )
}

export default PostRate;
