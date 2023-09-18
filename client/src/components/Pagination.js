import React from 'react'
import './Pagination.css';
import { useDispatch, useSelector } from "react-redux";
import { currentPage } from "../reducers/posts";

const Pagination = ({ postsPerPage, totalPosts, paginate}) => {
  const dispatch = useDispatch();
  const pageNumber = useSelector(currentPage);
  const pageNumbers = [];
  for(let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  } 
  if (pageNumbers.length !== 1) {
  return (
    <div className = "pagination">
    <ul>
    {pageNumbers.map(number => (
      <li key = {number}>
        {(parseInt(JSON.stringify(pageNumber.payload.posts.pageNumber)) !== number) ? <button className='pagination_button' onClick = {() => { paginate(number); dispatch(currentPage(number)); }}>{number}</button> : <button className='pagination_button' disabled>{number}</button>}
      </li>
    ))}
    </ul>
    </div>
  )
    } else { return (<div></div>) }
}

export default Pagination