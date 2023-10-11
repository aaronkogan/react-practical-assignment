import "./CommentPanel.css";
import { selectUser } from '../reducers/user';
import { deleteComment, selectCommentsQuery, editComment } from "../reducers/comments";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect  } from 'react';
import Modal from 'react-modal';

const CommentPanel = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const commentsQuery = useSelector(selectCommentsQuery);
    const [localEvent, setLocalEvent] = useState("hide");
    const [comment, setComment] = useState(props.text);
    const [likes, setLikes] = useState([...props?.likes]);
    const [dislikes, setDislikes] = useState([...props?.dislikes]);
    const isOwner = (user.name === props.owner);
    const isInArray = (list) => {
      for (var j=0; j<list.length; j++) {
          if (list[j] === user.name) return true;
      }
      return false;
      };
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
    useEffect(() => {
      const commentEditLike = async (query, id) => {
        const res = await fetch(`http://localhost:8080/comment/${id}`, {method: 'PUT', headers: {'Content-Type':'application/json'}, body: query});
        const json = await res.json();
        json.success && ((json.result = { ...json.result, event: 'editCommentLikeRate'}) && dispatch(editComment(json.result))) && setLocalEvent("hide") && console.warn("!!!!!! REESULT: "+ JSON.stringify(json.reult)); 
      }
      const commentEditDislike = async (query, id) => {
        const res = await fetch(`http://localhost:8080/comment/${id}`, {method: 'PUT', headers: {'Content-Type':'application/json'}, body: query});
        const json = await res.json();
        json.success && ((json.result = { ...json.result, event: 'editCommentDislikeRate'}) && dispatch(editComment(json.result))) && setLocalEvent("hide") && console.warn("!!!!!! REESULT: "+ JSON.stringify(json.reult)); 
      }
      if ((commentsQuery.event === 'editCommentDislikeRate' && commentsQuery.id === props.id) || (commentsQuery.event === 'editCommentLikeRate' && commentsQuery.id === props.id)) {
        const json = JSON.parse(JSON.stringify(commentsQuery));
        json['event'] =  String(commentsQuery.event).slice(0, -4)+"Panel";
        dispatch(editComment(json));
        setLikes([...commentsQuery.likes]);
        setDislikes([...commentsQuery.dislikes]);
      }
      if (commentsQuery.event === 'deleteCommentPanel') {
        const json = JSON.parse(JSON.stringify(commentsQuery));
        json['event'] =  'deleteComment';
        dispatch(deleteComment(json));
        setLocalEvent("hide");
      } else if (commentsQuery.event === 'editCommentPanelHide') {
        dispatch(editComment({event : "default"}));        
        setLocalEvent("hide");
      }
      ((localEvent==="like") && commentEditLike(JSON.stringify({id: props.id, postId: props.postId,  usename: user.name, likes: [...likes], dislikes: [...dislikes]}), props.id)) && setLocalEvent("hide");
      ((localEvent==="dislike") && commentEditDislike(JSON.stringify({id: props.id, postId: props.postId, usename: user.name, likes: [...likes], dislikes: [...dislikes]}), props.id)) && setLocalEvent("hide");
    },[dispatch, commentsQuery, likes, dislikes, localEvent, props.id, props.title, props.postId, user.name, props.commentsQuery]);

    const delComment = async (query) => {
      const res = await fetch(`http://localhost:8080/comment/${query}`, {method: 'DELETE', headers: {'Content-Type':'Authorization'}});
      const json = await res.json();
      if(json.success) {
        json.result = { ...json.result, event: 'deleteCommentPanel'};
        dispatch(deleteComment(json.result));
        setLocalEvent("hide");
      }
    }
    const fetchEditComment = async (query) => {
      const res = await fetch(`http://localhost:8080/comment/${props.id}`, {method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(query)});
      const json = await res.json();
      if(json.success) {
        json.result = { ...json.result, event: 'editCommentPanel'};
        dispatch(editComment(json.result));
        setLocalEvent("hide");
      }
    }
    return (    
        <div className="panelCommentsContainer">{isOwner ?
          <div className="panelComments">
            <button onClick={e => e.currentTarget === e.target && setLocalEvent("editComment")} title="Edit comment">&#9997;</button>
            <button onClick={e => e.currentTarget === e.target && setLocalEvent("deleteComment")} title="Delete comment">&#128465;</button>
            <button onClick={(e) => like(e)}  disabled={isInArray(likes)} title="Like">&#128077;{(likes.length>0 && likes[0]!==undefined) && <small style={{color: "green"}}> {likes?.length}</small>}</button> 
            <button onClick={(e) => dislike(e)}  disabled={isInArray(dislikes)} title="Dislike">&#128078;{(dislikes.length>0 && dislikes[0]!==undefined) && <small style={{color: "red"}}> {dislikes?.length}</small>}</button> 
          </div>
            :
          <div className="panelComments">
            <button onClick={(e) => like(e)}  disabled={isInArray(likes)} title="Like">&#128077;{(likes.length>0 && likes[0]!==undefined) && <small style={{color: "green"}}> {likes?.length}</small>}</button> 
            <button onClick={(e) => dislike(e)}  disabled={isInArray(dislikes)} title="Dislike">&#128078;{(dislikes.length>0 && dislikes[0]!==undefined) && <small style={{color: "red"}}> {dislikes?.length}</small>}</button> 
         </div>
        }

          <Modal onRequestClose={e => e.currentTarget === e.target && setLocalEvent("hide")} isOpen={localEvent !== "hide"} className="panelModal"  appElement={document.getElementById('root') || undefined}>
          {(() => {
              if (localEvent === "deleteComment") {
              return (
                <div className={`panelModal-${localEvent}`}>
                  <div>You want to delete comment?</div><br/>
                  <div>{props.text}</div>
                  <div><button onClick={e => e.currentTarget === e.target && delComment(props.id)} className="delete-button">Delete</button>
                  <button onClick={e => e.currentTarget === e.target && setLocalEvent("hide")} className="cancel_button">Cancel</button></div></div>
              )
            } else if (localEvent === "editComment")  {
              return( 
                <div className={`panelModal-${localEvent}`}>
                <div>
                <div>Edit comment on post</div>
                {props.date} 
                <div>{props.title} by {props.owner}</div>
                <img alt={props.title} src={props.url}></img>
                <textarea id="comment-input" onChange={(e) => setComment(e.target.value)} autoFocus defaultValue={comment} className="textarea"/>
                <div className="buttons_area">
                  <button onClick={e => e.currentTarget === e.target && fetchEditComment({ postId: props.postId, username: user.name, text: comment})} disabled={!(comment!==props.text && comment!=='')} className="add_button" >Edit comment</button>
                  <button onClick={e => e.currentTarget === e.target && setLocalEvent("hide")} className="cancel_button">Cancel</button>
                </div>
                </div>
                </div>
              )
            }
          })()}
          </ Modal>
          </div>
    )
}
export default CommentPanel;