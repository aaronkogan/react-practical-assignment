import "./Comments.css";
import { selectCommentsQuery, newComment, deleteComment, editComent } from "../reducers/comments";
import { useDispatch, useSelector } from "react-redux";
import Modal from 'react-modal';
import { useState, useEffect  } from 'react';

const Comments = (props) => {
  const dispatch = useDispatch();
  const [newCommentInput, setNewCommentInput] = useState("");
  const [enabled, setEnable] = useState(false);
  const [localEvent, setLocalEvent] = useState("hide"); 
  const addComment = async (query) => {
    const res = await fetch('http://localhost:8080/comment', {method: 'POST', headers: {'Content-Type':'application/json'}, body: query});
    const json = await res.json();
    json.success && dispatch(newComment(json.result))};   
  const handleNewComment = (e) => {
    setEnable(false);
    addComment(JSON.stringify({postId: props.id, username: props.owner, text: newCommentInput}));
    setNewCommentInput("");
    setLocalEvent("hide");
    e.preventDefault();
  };
  const handleHideNewComment = (e) => {
    setNewCommentInput("");
    setEnable(false);
    setLocalEvent("hide");
    e.preventDefault();
  };
  useEffect(() => {
    (newCommentInput.length > 0) ? setEnable(true) : setEnable(false);

  },[newCommentInput.length]);

return (
    <>
        <button 
            className="msg-pressed"
            aria-pressed={false}
            onClick={e => e.currentTarget === e.target && setLocalEvent("showCommentsModal")} 
            title="Show comments">&#128172; <small onClick={e => e.currentTarget === e.target && setLocalEvent("showCommentsModal")} >34</small>
        </button>
        <button 
            onClick={e => e.currentTarget === e.target && setLocalEvent("newCommentModal")} 
            title="New comment">&#128488;<small onClick={e => e.currentTarget === e.target && setLocalEvent("newCommentModal")} style={{ position: "absolute", marginLeft: "-20px", top: "2px"}}>+</small>
        </button>
        {(localEvent === "showCommentsModal") &&
        <div className="wrapper">
            <div className="shape bubble">
                heyfwfwef<br/>
                heydfdsfsf<br/>
                hey sdadsad ffdsfsdf f ef .ef ef ef /<br/>
                heydsfdsfds<br/>
                hesdfsdfsdy<br/>
                hesdffdkfdfdkv fjdkjfkjfkdj fkdjfdkfjslkfjlkfjsldkjfgsldkgjfsldkgjfsldkgjsldkjgfsldkjglsdfy<br/>
                hey<br/>
                hey<br/>
                hesdfsdfdsfy<br/>
                hey<br/>
                hsdfsdfsdfey<br/>
                hsdfsdfey<br/>
            </div>
        </div>
        }
          <Modal 
            onRequestClose={e => e.currentTarget === e.target && handleHideNewComment(e)} 
            isOpen={localEvent !== "hide" && localEvent !== "showCommentsModal"} 
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
