import "./Panel.css";
import { selectUser } from '../reducers/user';
import {  useSelector } from "react-redux";



const Panel = (props) => {
    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
      };
    const user = useSelector(selectUser);
    const isOwner = (user.name === props.owner);
    return (    
        <div className="panel" >  {isOwner ? <div><button title="Edit post">&#9997;</button><button title="Delete post">&#128465;</button><button title="Like">&#128077;</button><button title="Dislike">&#128078;</button><button title="Show comments">&#128172;</button><button title="New comment">&#128488;</button><button title="Open picture in new tab" onClick={e => e.currentTarget === e.target && openInNewTab(props.url)}>&#128444;</button></div>: <div><button title="Like">&#128077;</button><button title="Dislike">&#128078;</button><button title="Show comments">&#128172;</button><button title="New comment">&#128488;</button><button title="Open picture in new tab" onClick={e => e.currentTarget === e.target && openInNewTab(props.url)}>&#128444;</button></div>}</div>
    )
}
export default Panel;