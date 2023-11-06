import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import "./Login.css";
import { login } from "../reducers/user";
import { useCookies } from 'react-cookie';

const Login = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [cookies] = useCookies(['user']);
  const handleSubmit = useCallback(() => {
    dispatch(login({ name: name }));
  }, [dispatch, name]);
  useEffect(() => {
    (cookies["user"] !== "" && cookies["user"] !== undefined) && dispatch(login({ name: cookies["user"] }));
  }, [cookies, dispatch]);
  const enabled = name.length > 0;
  return (
    <div className="login">
      <form className="login_form" onSubmit={handleSubmit}>
        <h1>Gallery WEB Application</h1>
        <input
          autoFocus
          type="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button disabled={!enabled} defaultValue="" type="Log In" className="submit_btn">
          Continue
        </button>
      </form>
    </div>
  );
};

export default Login