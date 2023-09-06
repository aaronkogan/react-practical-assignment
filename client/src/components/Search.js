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
    console.log('##6666 '+JSON.stringify(json));
    this.props.searchPosts(json);
    console.log('##3333'+JSON.stringify(json));
    };
  
  async fetchPosts (query) {
    console.warn('fetching ' + query);
    const res = await fetch(query, {method: 'GET', headers: {'Content-Type':'Authorization'}});
    const json = await res.json();
    console.log('##5555 '+JSON.stringify(json));
    this.props.getPosts(json);
    console.log('##4444'+query);
    };

  onChange(query) {
    this.setState({ query });
    this.searchValue(query);
  }
  searchValue = (query) => {
    (query == '' || query == undefined) ? this.fetchPosts('http://localhost:8080/post/') : this.fetchSearch('http://localhost:8080/post/search/'+query);
    console.log("22222 "+ query)
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
  searchPosts: json => (
    dispatch({ type: "posts/searchPosts", payload: json })
  ),

  getPosts: (json) => (
    dispatch({ type: "posts/getPosts", payload: json })
  )

})


export default connect(null,mapDispatchToProps)(Search)