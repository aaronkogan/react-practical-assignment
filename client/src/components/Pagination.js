import React from 'react'
import './Pagination.css';
import { useDispatch } from "react-redux";
import { currentPage } from "../reducers/posts";

const Pagination = ({ postsPerPage, totalPosts, paginate, page }) => {
  const dispatch = useDispatch();
  const pageNumbers = [];
  for(let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  } 
  pageNumbers.length < page && pageNumbers.length !== 1 && pageNumbers.length !== 0 && dispatch(currentPage(page-1))
  if (pageNumbers.length !== 1) {
  return (
    <div key="paginate" className = "pagination">
    <ul>
    {pageNumbers.map(number => (
      <li key = {number}>
        {(page !== number) ? <button className='pagination_button' onClick = {() => { paginate(number); dispatch(currentPage(number)); }}>{number}</button> : <button className='pagination_button' disabled>{number}</button>}
      </li>
    ))}
    </ul>
    </div>
  )
    } else { return (<div key="paginate"></div>) }
}

export default Pagination