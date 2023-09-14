import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./Login.css";
import { login } from "../reducers/user";
import { useCookies } from 'react-cookie';

const Login = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [cookies, setCookie] = useCookies(['user']);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      login({
        name: name
      })
    );
  };
  if(cookies["user"] !== "" && cookies["user"] !== undefined) 
  {
    dispatch(
      login({
        name: cookies["user"]
      })
    );      
  }
  const enabled = name.length > 0;
  return (
      <div className="login">
        <form className="login_form" onSubmit={(e) => handleSubmit(e)}>
          <h1>Gallery WEB Application</h1>
          <input
            type="name" 
            placeholder="Enter your name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
          <button disabled={!enabled} type="Log In" className="submit_btn">
            Continue
          </button>
        </form>
      </div>
  );
};
export default Login