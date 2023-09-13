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

  async componentDidMount() {
    console.log('Fist fetching');
    this.fetchPosts('http://localhost:8080/post/')
  }
  
  async fetchSearch(query){
    console.warn('fetching ' + query);
    const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
    const json = await res.json();
    this.props.currentPage(1);
    this.props.searchPosts(json);
    };
  
  async fetchPosts (query) {
    console.warn('fetching ' + query);
    const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
    const json = await res.json();
    this.props.currentPage(1);
    this.props.getPosts(json);
  };

  onChange(query) {
    this.setState({ query });
    this.searchValue(query);
  }
  searchValue = (query) => {
    (query === '' || query === undefined) ? this.fetchPosts('http://localhost:8080/post/') : this.fetchSearch('http://localhost:8080/post/search/'+query);
    }

  render() {
    return (
      <div className="search">
        <input 
        placeholder="Search"
        type="text"
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

  getPosts: (json) => (
    dispatch({ type: "posts/getPosts", payload: json })
  ),

  currentPage: (num) => (
    dispatch({ type: "posts/currentPage", payload: num })
  ),

})


export default connect(null,mapDispatchToProps)(Search)