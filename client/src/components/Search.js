import "./Search.css";
import  { fetchSearch, lastPageFetch }  from "../services/Api";
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
  onChange(query) {
    this.setState({ query });
    this.searchValue(query);
  }
  searchValue = async (query) => {
    if (this.props.searchQuerySelect !== query) {
      if (query === '') {
        const json = await lastPageFetch();
        json.success && this.props.getPosts(json);
        this.props.currentPage(json.totalPages);
        this.props.searchQuery(this.state.query);
      } else if (!(query[0] === ('/') || query[0] === ('\\') || query[0] === ('%') || query === undefined)) {
        const json = await fetchSearch(query);
        json.success && this.props.searchPosts(json) && this.props.searchQuery(this.state.query);      
      }
    }
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
          onChange={(event, value) => this.onChange(String(event.target.value).trimStart())}
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
    dispatch({ type: "comments/hideCommentsEvent", payload: json })
  )
})

const mapStateToProps = (state) => ({
  searchQuerySelect: state.posts.query
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)