import "./Header.css";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../reducers/user";
import { resetPosts } from "../reducers/posts";
import { resetPost } from "../reducers/post";
import { resetComments } from "../reducers/comments";


import { useCookies } from 'react-cookie';

const Header = () => {
  const user = useSelector(selectUser);
  const [cookies, setCookie] = useCookies(['user']);
  const dispatch = useDispatch();
  useEffect(() => {
    setCookie('user', user.name, { path: '/' });
  }, [setCookie, user.name]);
  const handleLogout = useCallback(() => {
    setCookie('user', '', { path: '/' })
    dispatch(resetPosts());
    dispatch(resetPost());
    dispatch(resetComments());
    dispatch(logout())}, [dispatch, setCookie]);
  return (
    <div className="logout">
      <span className="user_name">{cookies.user}</span>
      <button className="logout_button" aria-label="Log out" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

export default Header;