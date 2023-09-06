import React from 'react'
import './Pagination.css';


const Pagination = ({ postsPerPage, totalPosts, paginate}) => {
  const pageNumbers = [];

  for(let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  } 

  return (
    <div className = "pagination">
    <ul>
    {pageNumbers.map(number => (
      <li key = {number}>
        <button className='pagination_button' onClick = {() => paginate(number)}>{number}</button>
      </li>
    ))}
    </ul>
    </div>
  )
}


export default Pagination