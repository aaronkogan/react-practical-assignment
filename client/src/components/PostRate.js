import { selectUser } from '../reducers/user';
import { editPost, selectPostQuery } from "../reducers/post";
import { hideCommentsEvent } from "../reducers/comments";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

const PostRate = (props) => {
    console.warn("Rate: "+ JSON.stringify(props));
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
            json['event'] =  String(postQuery.event).slice(0, -4);
            dispatch(editPost(json));
            setLikes([...postQuery.likes]);
            setDislikes([...postQuery.dislikes]);
        }
        const postEditLike = async (query,id) => {
            const res = await fetch(`http://localhost:8080/post/${id}`, {method: 'PUT', headers: {'Content-Type':'application/json'}, body: query});
            const json = await res.json();
            json.success && ((json.result = { ...json.result, event: 'editPostLikeRate'}) && dispatch(editPost(json.result))) && setLocalEvent("default") && console.warn("!!!!!! REESULT: "+ JSON.stringify(json.reult)); 
        }
        const postEditDislike = async (query,id) => {
            const res = await fetch(`http://localhost:8080/post/${id}`, {method: 'PUT', headers: {'Content-Type':'application/json'}, body: query});
            const json = await res.json();
            json.success && ((json.result = { ...json.result, event: 'editPostDislikeRate'}) && dispatch(editPost(json.result))) && setLocalEvent("default") && console.warn("!!!!!! REESULT: "+ JSON.stringify(json.reult)); 
        }
        (localEvent==="like") && postEditLike(JSON.stringify({id: props.id, usename: user.name, title: props.title, likes: [...likes], dislikes: [...dislikes]}), props.id);
        (localEvent==="dislike") && postEditDislike(JSON.stringify({id: props.id, usename: user.name, title: props.title, likes: [...likes], dislikes: [...dislikes]}), props.id);
        setLocalEvent("default");
        },[likes, dislikes, dispatch, props.id, localEvent, user.name, props.title, postQuery]);
    const isInArray = (list) => {
        for (var j=0; j<list.length; j++) {
            if (list[j] === user.name) return true;
        }
        return false;
    }
    const like = (e) => {
        if ( dislikes.indexOf(user.name) > -1 ) {
            dislikes.splice( dislikes.indexOf(user.name) , 1 )
        }
        setLikes([...likes, user.name]);
        setLocalEvent("like");
    };
    const dislike  =(e) => {
        if ( likes.indexOf(user.name) > -1 ) {
            likes.splice( likes.indexOf(user.name) , 1 )
        }
        setDislikes([...dislikes, user.name]);
        setLocalEvent("dislike");            
    };
return (
    <>
    <button 
        onClick={(e) => like(e)} 
        disabled={isInArray(likes)} 
        title="Like">&#128077;{(likes.length>0 && likes[0]!==undefined) && <small style={{color: "green"}}> {likes?.length}</small>}
    </button>
    <button 
        onClick={(e) => dislike(e)} 
        disabled={isInArray(dislikes)} 
        title="Dislike">&#128078;{(dislikes.length>0 && dislikes[0]!==undefined) && <small style={{color: "red"}}> {dislikes?.length}</small>}
    </button>
    </>
)
}

export default PostRate;
