import React from 'react'
import './Pagination.css';


const Pagination = ({ postsPerPage, totalPosts, paginate}) => {
  const pageNumbers = [];

  for(let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  } 

  return (
    <div className = "pagination-container">
    <ul>
    {pageNumbers.map(number => (
      <li className = "pagination-item" key = {number}>
        <a onClick = {() => paginate(number)} href = "#!">{number}</a>
      </li>
    ))}
    </ul>
    </div>
  )
}


export default Pagination