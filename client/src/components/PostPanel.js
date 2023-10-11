import "./PostPanel.css";
import  RedactPost  from './EditPost';
import  PostRate  from './PostRate';
import  Comments  from "./Comments";
import { selectUser } from '../reducers/user';
import { deletePost, selectPostQuery, editPost } from "../reducers/post";
import { hideCommentsEvent } from "../reducers/comments";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect  } from 'react';
import Modal from 'react-modal';

const PostPanel = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const postQuery = useSelector(selectPostQuery);
    const [Event, setEvent] = useState("hide");
    const isOwner = (user.name === props.owner);
    const openInNewTab = url => { dispatch(hideCommentsEvent()) && window.open(url, '_blank', 'noopener,noreferrer') };
    useEffect(() => {
      if (postQuery.event === 'editPostPanel') {
        const json = JSON.parse(JSON.stringify(postQuery));
        json['event'] =  'editPost';
        dispatch(editPost(json));
        setEvent("hide");
      } else if (postQuery.event === 'editPostPanelHide') {
        dispatch(editPost({event : "default"}));        
        setEvent("hide");
      }
    },[dispatch, postQuery, props.postQuery]);

    const delPost = async (query) => {
      const res = await fetch(`http://localhost:8080/post/${query}`, {method: 'DELETE', headers: {'Content-Type':'Authorization'}});
      const json = await res.json();
      if(json.success) {
        json.result = { ...json.result, event: 'deletePost'};
        dispatch(deletePost(json.result));
        setEvent("hide");
      }
    }
    return (    
        <div className="panel">{isOwner ? 
          <div>
            <button onClick={e => e.currentTarget === e.target && dispatch(hideCommentsEvent()) && setEvent("editPost")} title="Edit post">&#9997;</button>
            <button onClick={e => e.currentTarget === e.target && dispatch(hideCommentsEvent()) && setEvent("deletePost")} title="Delete post">&#128465;</button>
            <PostRate id={props.id} title={props.title} likes={props.likes} dislikes={props.dislikes}/>
            <Comments id={props.id} postId={props.postId} title={props.title} owner={props.owner} url={props.url} date={props.date} comments={props.comments}/>
            <button title="Open picture in new tab" onClick={e => e.currentTarget === e.target && openInNewTab(props.url)}>&#128444;</button>
          </div>
          :
          <div>
            <PostRate id={props.id} likes={props.likes} dislikes={props.dislikes}/>
            <Comments id={props.id} postId={props.postId} title={props.title} owner={props.owner} url={props.url} date={props.date} comments={props.comments}/>
            <button title="Open picture in new tab" onClick={e => e.currentTarget === e.target && openInNewTab(props.url)}>&#128444;</button></div>}
          <Modal onRequestClose={e => e.currentTarget === e.target && setEvent("hide")} isOpen={Event !== "hide"} className="panelModal"  appElement={document.getElementById('root') || undefined}>
          {(() => {
              if (Event === "deletePost") {
              return (
                <div className={`panelModal-${Event}`}>
                  <div>You want to delete post {props.title}?</div><br/>
                  <div><button onClick={e => e.currentTarget === e.target && delPost(props.id)} className="delete-button">Delete</button>
                  <button onClick={e => e.currentTarget === e.target && setEvent("hide")} className="cancel_button">Cancel</button></div></div>
              )
            } else if (Event === "editPost")  {
              return( 
                <div className={`panelModal-${Event}`}>
                  <RedactPost id={props.id} title={props.title} url={props.url}/></div>
              )
            }
          })()}
          </ Modal>
          </div>
    )
}
export default PostPanel;