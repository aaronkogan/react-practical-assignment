import "./Header.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../reducers/user";
import { resetPosts } from "../reducers/posts";
import { resetPost } from "../reducers/post";

import { useCookies} from 'react-cookie';

const Header = () => {
const user = useSelector(selectUser);
const [cookies, setCookie] = useCookies(['user']);
useEffect(() => {
  setCookie('user', user.name, {path: '/'});
}, []);
const dispatch = useDispatch();
const handleLogout = (e) => {
  setCookie('user', '', {path: '/'})
  e.preventDefault();
  dispatch(resetPosts());
  dispatch(resetPost());
  dispatch(logout());
};
return (
    <div className="logout">
      <span className="user_name">{user.name}</span>
      <button className="logout_button" aria-label="Log out" onClick={(e) => handleLogout(e)}>
        Log out
      </button>
    </div>
);
};

export default Header;