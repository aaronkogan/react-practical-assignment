import "./Comments.css";
import { useState, useEffect  } from 'react';

const Comments = (props) => {
    const [Event, setEvent] = useState("hide");

return (
    <>
        <button 
            onClick={e => e.currentTarget === e.target && setEvent("showComments")} 
            title="Show comments">&#128172; <small style={{borderRadius: "25%", backgroundColor: "white", top: "2px"}}>34</small>
        </button>
        <button 
            onClick={e => e.currentTarget === e.target && setEvent("newComment")} 
            title="New comment">&#128488;<small style={{ position: "absolute", marginLeft: "-20px", top: "2px"}}>+</small>
        </button>
    </>
)
}

export default Comments;
