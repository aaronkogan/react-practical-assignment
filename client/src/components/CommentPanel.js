import "./CommentPanel.css";
import { selectUser } from '../reducers/user';
import { deleteComment, selectCommentsQuery, editComment } from "../reducers/comments";
import { hideCommentsEvent } from "../reducers/comments";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect  } from 'react';
import Modal from 'react-modal';

const CommentPanel = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const commentsQuery = useSelector(selectCommentsQuery);
    const [Event, setEvent] = useState("hide");
    const isOwner = (user.name === props.owner);
    useEffect(() => {
      if (commentsQuery.event === 'editCommentPanel') {
        const json = JSON.parse(JSON.stringify(selectCommentsQuery));
        json['event'] =  'editComment';
        dispatch(editComment(json));
        setEvent("hide");
      } else if (commentsQuery.event === 'editCommentPanelHide') {
        dispatch(editComment({event : "default"}));        
        setEvent("hide");
      }
    },[dispatch, commentsQuery, props.commentsQuery]);

    const delComment = async (query) => {
      const res = await fetch(`http://localhost:8080/post/${query}`, {method: 'DELETE', headers: {'Content-Type':'Authorization'}});
      const json = await res.json();
      if(json.success) {
        json.result = { ...json.result, event: 'deletePost'};
        dispatch(deleteComment(json.result));
        setEvent("hide");
      }
    }
    return (    
        <div className="panelCommentsContainer">{isOwner ?
          <div className="panelComments">
            <button onClick={e => e.currentTarget === e.target && setEvent("editPost")} title="Edit post">&#9997;</button>
            <button onClick={e => e.currentTarget === e.target && setEvent("deletePost")} title="Delete post">&#128465;</button>
            <button>&#128077;</button> 
            <button>&#128078;</button> 
          </div>
            :
          <div className="panelComments">
            <button>&#128077;</button> 
            <button>&#128078;</button> 
          </div>
        }

          <Modal onRequestClose={e => e.currentTarget === e.target && setEvent("hide")} isOpen={Event !== "hide"} className="panelModal"  appElement={document.getElementById('root') || undefined}>
          {(() => {
              if (Event === "deleteComment") {
              return (
                <div className={`panelModal-${Event}`}>
                  <div>You want to delete post {props.title}?</div><br/>
                  <div><button onClick={e => e.currentTarget === e.target && delComment(props.id)} className="delete-button">Delete</button>
                  <button onClick={e => e.currentTarget === e.target && setEvent("hide")} className="cancel_button">Cancel</button></div></div>
              )
            } else if (Event === "editComment")  {
              return( 
                <div className={`panelModal-${Event}`}>
                  {console.warn("PanelModalEditComment")}</div>
              )
            }
          })()}
          </ Modal>
          </div>
    )
}
export default CommentPanel;