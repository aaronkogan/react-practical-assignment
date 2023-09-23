import "./Panel.css";
import { selectUser } from '../reducers/user';
import { deletePost } from "../reducers/post";
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react';
import Modal from 'react-modal';

const Panel = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [Event, setEvent] = useState("hide");
    const isOwner = (user.name === props.owner);
    const openInNewTab = url => { window.open(url, '_blank', 'noopener,noreferrer') };
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
        <div className="panel">{isOwner ? <div><button onClick={e => e.currentTarget === e.target && setEvent("editPost")} title="Edit post">&#9997;</button><button onClick={e => e.currentTarget === e.target && setEvent("deletePost")} title="Delete post">&#128465;</button><button onClick={e => e.currentTarget === e.target && setEvent("like")} title="Like">&#128077;</button><button onClick={e => e.currentTarget === e.target && setEvent("dislike")} title="Dislike">&#128078;</button><button onClick={e => e.currentTarget === e.target && setEvent("showComments")} title="Show comments">&#128172;</button><button onClick={e => e.currentTarget === e.target && setEvent("newComment")} title="New comment">&#128488;</button><button title="Open picture in new tab" onClick={e => e.currentTarget === e.target && openInNewTab(props.url)}>&#128444;</button></div>: <div><button onClick={e => e.currentTarget === e.target && setEvent("like")} title="Like">&#128077;</button><button onClick={e => e.currentTarget === e.target && setEvent("dislike")} title="Dislike">&#128078;</button><button onClick={e => e.currentTarget === e.target && setEvent("showComments")} title="Show comments">&#128172;</button><button onClick={e => e.currentTarget === e.target && setEvent("newComment")} title="New comment">&#128488;</button><button title="Open picture in new tab" onClick={e => e.currentTarget === e.target && openInNewTab(props.url)}>&#128444;</button></div>}
        <Modal onRequestClose={e => e.currentTarget === e.target && setEvent("hide")} isOpen={Event !== "hide"} className="panelModal"  appElement={document.getElementById('root') || undefined}>
        {(() => {
            if (Event === "deletePost") {
            return (
              <div className={`panelModal-${Event}`}><div>You want to delete post {props.title}?</div><br/><div><button onClick={e => e.currentTarget === e.target && delPost(props.id)} className="delete-button">Delete</button><button onClick={e => e.currentTarget === e.target && setEvent("hide")} className="cancel_button">Cancel</button></div></div>
            )
          } else if (Event === "editPost")  {
            <div className="panelModal"><button onClick={e => e.currentTarget === e.target && setEvent("hide")} className="cancel_button">Cancel</button></div>
          }
        })()}
        </ Modal>
        </div>
    )
}
export default Panel;