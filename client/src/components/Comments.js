import "./Comments.css";
import CommentPanel from "./CommentPanel";
import { selectUser } from "../reducers/user";
import timeConverter from "../utills/TimeConverter";
import { selectCommentsQuery, newComment, resetCommentsEvent, deleteComment, editComment } from "../reducers/comments";
import { useDispatch, useSelector } from "react-redux";
import Modal from 'react-modal';
import { useState, useEffect  } from 'react';

const Comments = (props) => {
  console.warn("Comments: "+ JSON.stringify(props));
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const commentsQuery = useSelector(selectCommentsQuery);
  const [newCommentInput, setNewCommentInput] = useState("");
  const [enabled, setEnable] = useState(false);
  const [comments, setComments] = useState(props.comments);
  const [showComments, setShowComments] = useState(false);
  const [localEvent, setLocalEvent] = useState("hide"); 
  const addComment = async (query) => {
    const res = await fetch('http://localhost:8080/comment', {method: 'POST', headers: {'Content-Type':'application/json'}, body: query});
    const json = await res.json();
    if(json.success) {
      json.result = { ...json.result, event: 'addCommentPanel'};
      dispatch(newComment(json.result));
      setLocalEvent("hide");
    }
  }
  const handleShowComments = (e) => {
    (!showComments) ? setLocalEvent("showComments") :  setLocalEvent("hideComments")
    e.preventDefault();
  };
  const handleClickNewComment = (e) => {
    setLocalEvent("newCommentModal");
    setShowComments(false);
    e.preventDefault();
  };
  const handleNewComment = (e) => {
    setEnable(false);
    addComment(JSON.stringify({postId: props.id, username: user.name, text: newCommentInput}));
    setNewCommentInput("");
    e.preventDefault();
  };
  const handleHideNewComment = (e) => {
    setNewCommentInput("");
    setEnable(false);
    setLocalEvent("hide");
    e.preventDefault();
  };
  if(localEvent === "showComments") {
    setShowComments(true);
    setLocalEvent("hide");
    }
  if(localEvent === "hideComments") {
    setShowComments(false);
    setLocalEvent("hide");
    }
  useEffect(() => {
    (newCommentInput.length > 0) ? setEnable(true) : setEnable(false);
    if ((commentsQuery.event === 'addCommentPanel' && commentsQuery.postId === props.id)) {
      const json = JSON.parse(JSON.stringify(commentsQuery));
      delete json['event'];
      setComments([...comments, json]);
      json.event = 'addComment';
      dispatch(newComment(json));
    }
    if (commentsQuery.event === 'hideComments') {
      setShowComments(false);
      dispatch(resetCommentsEvent);
    }
  },[newCommentInput.length, props.id, commentsQuery, dispatch, comments]);

return (
    <>
        <button 
            className={(showComments) ? "msg-pressed" : "msg-unpressed"}
            aria-pressed={false}
            onClick={e => e.currentTarget === e.target && handleShowComments(e)} 
            disabled={(!comments?.length>0)}
            title="Show comments">&#128172; 
            <small onClick={e => e.currentTarget === e.target && handleShowComments(e)} > {(comments?.length>0) && comments.length}</small>
        </button>
        <button 
            onClick={e => e.currentTarget === e.target && handleClickNewComment(e)} 
            title="New comment">&#128488;<small onClick={e => e.currentTarget === e.target && setLocalEvent("newCommentModal")} style={{ position: "absolute", marginLeft: "-20px", top: "2px"}}>+</small>
        </button>
        <div style={{display: (showComments) ? "inline-block" : "none"}} className="wrapper">
            <div className="shape bubble">
              {comments.map((comment) => (  
                <div className="msg-container" key={JSON.stringify(comment.id)}>
                  <div className="msg">
                  <div>{comment.username} {timeConverter(comment.date)}</div>
                  <CommentPanel postId={props.id} id={comment.id} title={props.title} owner={comment.username} url={props.url} date={comment.date} comments={props.comments}/>
                  <div>{comment.text}</div>
                </div>
                </div>
                ))}  
            </div>
        </div>
          <Modal 
            onRequestClose={e => e.currentTarget === e.target && handleHideNewComment(e)} 
            isOpen={localEvent !== "hide" && localEvent !== "showComments" && localEvent !== "hideComments" } 
            className="modal"  
            appElement={document.getElementById('root') || undefined}>
          {(() => {
              if (localEvent === "newCommentModal") {
              return (
                <div>
                  <div>New comment on post</div>
                  {props.date} 
                  <div>{props.title} by {props.owner}</div>
                  <img onClick={e => e.currentTarget === e.target && handleHideNewComment(e)} alt={props.title} className={`modal-img`} src={props.url}></img>
                  <textarea id="comment-input" onChange={(e) => setNewCommentInput(e.target.value)} autoFocus className="textarea"/>
                  <div className="buttons_area">
                    <button className="add_button" onClick={e => e.currentTarget === e.target && handleNewComment(e)} disabled={!enabled}>Add comment</button>
                    <button onClick={e => e.currentTarget === e.target && handleHideNewComment(e)} className="cancel_button">Cancel</button>
                  </div>
                </div>
              )
            } else if (localEvent === "editPost")  {
              return( 
                <div className={`panelModal-${localEvent}`}>ddd</div>
              )
            }
          })()}
          </ Modal>
    </>
  )
}

export default Comments;
