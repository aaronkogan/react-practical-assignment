// import {React, useEffect }from 'react';
// import Login from './components/Login';
// import Main from './components/Main';
// //import "./App.css";
// import { useSelector } from 'react-redux';
// import { selectUser } from './reducers/user';

// const usePageMeta = (title, description) =>{
//   const defaultTitle = "app-name";
//   const defaultDesc = "meta description";

//   useEffect(() => {
//       document.title = title || defaultTitle;
//       document.querySelector("meta[name='description']").setAttribute("content", description || defaultDesc);
//   }, [defaultTitle, title, defaultDesc, description]);
// };



// function App() {
//   const user = useSelector(selectUser);
  
//     return (
//       usePageMeta("Demo Page Title", "Demo meta description"),
//     <div>{user ? <Main /> : <Login />}</div>
//   );
// }

// export default App;


import React, { useLayoutEffect, useState, useEffect } from 'react';
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

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function App() {
  const user = useSelector(selectUser);
  const [width, height] = useWindowSize();
  return (usePageMeta("Demo Page Title", "Demo meta description"),<div>{user ? <Main /> : <Login />}<span>Window size: {width} x {height}</span></div>)
}

export default App;