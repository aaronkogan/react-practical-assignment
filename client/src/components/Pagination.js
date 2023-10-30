import React from 'react'
import  { fetchPosts }  from "../services/Api";
import './Pagination.css';
import { useDispatch, useSelector } from "react-redux";
import { currentPage, selectPage, selectSearchQuery, getPosts } from "../reducers/posts";

const Pagination = ({ pagesCount }) => {
  const dispatch = useDispatch();
  const page = useSelector(selectPage);
  const search = useSelector(selectSearchQuery);
  const pagePosts = async (query) => {
    const json = await fetchPosts(query);
    json.success && dispatch(currentPage(json.page)) && dispatch(getPosts(json)) && window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };
  if (!search) {
    const pageNumbers = [];
    for (let i = 1; i <= pagesCount; i++) {
      pageNumbers.push(i)
    }
    return (
      <div key="paginate" className="pagination">
        <ul>
          {pageNumbers.length !==1 && pageNumbers.map(number => (
            <li key={number}>
              {(page !== number) ?
                <button className='pagination_button' onClick={() => { pagePosts(number) }}>{number}</button>
                :
                <button className='pagination_button' disabled>{number}</button>}
            </li>
          ))}
        </ul>
      </div>
    )
  } else return (<div key="paginate" className="pagination"></div>);
}

export default Pagination