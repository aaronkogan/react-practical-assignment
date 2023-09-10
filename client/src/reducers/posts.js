import { createSlice } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: null,
        pageNumber: 1
    },
    reducers: {
        searchPosts: (state, action) => {
            state.posts = action.payload;
        },
        getPosts: (state, action) => {
            state.posts = action.payload;
        },
        newPost: (state, action) => {
            state.posts = action.payload;
        },
        editPost: (state, action) => {
            state.posts = action.payload;
        },
        deletePost: (state, action) => {
            state.posts = action.payload;
        },
        currentPage: (state, action) => {
            state.pageNumber = action.payload;
        },
    },
});

export const { searchPosts, getPosts,newPost, editPost, deletePost, currentPage } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;

export default postsSlice.reducer;