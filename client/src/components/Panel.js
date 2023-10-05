import "./Panel.css";
import  RedactPost  from './EditPost';
import  RatePost  from './RatePost';
import  Comments  from "./Comments";
import { selectUser } from '../reducers/user';
import { deletePost, selectPostQuery, editPost } from "../reducers/post";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect  } from 'react';
import Modal from 'react-modal';

const Panel = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const postQuery = useSelector(selectPostQuery);
    const [Event, setEvent] = useState("hide");
    const isOwner = (user.name === props.owner);
    const openInNewTab = url => { window.open(url, '_blank', 'noopener,noreferrer') };
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
            <button onClick={e => e.currentTarget === e.target && setEvent("editPost")} title="Edit post">&#9997;</button>
            <button onClick={e => e.currentTarget === e.target && setEvent("deletePost")} title="Delete post">&#128465;</button>
            <RatePost id={props.id} title={props.title} likes={props.likes} dislikes={props.dislikes}/>
            <Comments id={props.id} title={props.title} owner={props.owner} url={props.url} date={props.date} comments={props.comments}/><button title="Open picture in new tab" onClick={e => e.currentTarget === e.target && openInNewTab(props.url)}>&#128444;</button>
          </div>
          :
          <div>
            <RatePost id={props.id} likes={props.likes} dislikes={props.dislikes}/>
            <Comments id={props.id} title={props.title} owner={props.owner} url={props.url} comments={props.comments}/>
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
export default Panel;