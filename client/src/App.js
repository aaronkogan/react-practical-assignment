import { useEffect } from 'react';
import Login from './components/Login';
import Main from './components/Main';
import "./App.css";
import { useSelector } from 'react-redux';
import { selectUser } from './reducers/user';

const usePageMeta = (title, description) =>{
  const defaultTitle = "app-name";
  const defaultDesc = "meta description";

  useEffect(() => {
      document.title = title || defaultTitle;
      document.querySelector("meta[name='description']").setAttribute("content", description || defaultDesc);
  }, [defaultTitle, title, defaultDesc, description]);
};

function App() {
  const user = useSelector(selectUser);
  return (usePageMeta("Web App Photo Gallery", "Practical assignment"),<div>{user ? <Main /> : <Login />}</div>)
}

export default App;