import "./Search.css";
import debounce from 'lodash.debounce';
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchPosts, getPosts } from "../reducers/posts";


function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below). 
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value] 
  );

  return debouncedValue;
}

const Search = () => {
	const dispatch = useDispatch();
	const fetchSearch = async (query, cb) => {
		console.warn('fetching ' + query);
		const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
		cb(res);
		const json = await res.json();
		dispatch(searchPosts(json));
		console.log('##3333'+JSON.stringify(json));
	  };

  const fetchPosts = async (query) => {
		console.warn('fetching ' + query);
		const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
		const json = await res.json();
		dispatch(getPosts(json))
		console.log('##4444'+query);
	  };

  const debouncedFetchData = debounce((query, cb) => {
		fetchSearch('http://localhost:8080/post/search/'+query, cb);
	  }, 500);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const debouncedSearchTerm = useDebounce(query, 500);
    useEffect(() => {
		query ? debouncedFetchData(query, res => {
			setResults(res);
			}) : fetchPosts('http://localhost:8080/post/')

    }, [query]
    )

  return (
    <div className="search">
      <input placeholder="Search filter" value={query} type="text" onChange={e => {setQuery(e.target.value)}}/>
    </div>
  );
}

export default Search;