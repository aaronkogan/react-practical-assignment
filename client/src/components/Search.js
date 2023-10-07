import "./Search.css";
import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from 'lodash';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || null
    }
    this.searchValue = _.debounce(this.searchValue, 1000);
  }
  async fetchSearch(query){
    const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
    const json = await res.json();
    json.success && this.props.searchPosts(json) && this.props.searchQuery(this.state.query);
    };
  async fetchPosts (query) {
    const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
    const json = await res.json();
    json.success && this.props.getPosts(json) && this.props.searchQuery(this.state.query);
  };
  async lastPageFetch (query) {
    const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
    const json = await res.json();
    this.fetchPosts(`http://localhost:8080/post/page/${json.totalPages}`) && this.props.currentPage(json.totalPages);
  };
  onChange(query) {
    this.setState({ query });
    this.searchValue(query);
  }
  searchValue = (query) => {
    (query === '' || query[0] === ('/') || query[0] === ('\\') || query[0] === ('%') || query === undefined) ? this.lastPageFetch('http://localhost:8080/post/page/1') : this.fetchSearch('http://localhost:8080/post/search/'+query);
    }
  render() {
    return (
      <div className="search">
        <input 
        onFocus={() => this.props.hideCommentsEvent()}
        autoFocus
        placeholder="Search"
        type="text"
        id="search"
        onChange={(event, value) => this.onChange(event.target.value)}
        value={this.state.value || undefined}
        />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  searchPosts: (json) => (
    dispatch({ type: "posts/searchPosts", payload: json })
    
  ),
  searchQuery: (json) => (
    dispatch({ type: "posts/searchQuery", payload: json })
  ),
  getPosts: (json) => (
    dispatch({ type: "posts/getPosts", payload: json })
  ),
  currentPage: (json) => (
    dispatch({ type: "posts/currentPage", payload: json })
  ),
  hideCommentsEvent: (json) => (
    dispatch({ type: "comments/hideCommentsEvent", payload: json  })
  )
})

export default connect(null,mapDispatchToProps)(Search)