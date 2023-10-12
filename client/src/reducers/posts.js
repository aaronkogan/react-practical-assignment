import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    pageNumber: 1,
    query: "",
    payload: { Event: "firstStart" }
}

export const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        searchPosts: (state, action) => {
            state.pageNumber = 1;
            state.posts = action.payload;
        },
        searchQuery: (state, action) => {
            state.query = action.payload;
        },
        getPosts: (state, action) => {
            state.posts = action.payload;
        },
        currentPage: (state, action) => {
            state.pageNumber = action.payload;
        },
        resetPosts: (state, action) => {
            Object.assign(state, initialState);
        }
    },
});

export const { searchPosts, getPosts, currentPage, searchQuery, resetPosts } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;

export const selectPage = (state) => state.posts.pageNumber;

export const selectSearchQuery = (state) => state.posts.query;

export default postsSlice.reducer;