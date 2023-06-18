import { createSlice } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: null,
    },
    reducers: {
        searchPosts: (state, action) => {
            console.warn('Redux search posts' + JSON.stringify(action.payload));
            state.posts = action.payload;
        },
        getPosts: (state, action) => {
            console.warn('Redux get ALL posts' + JSON.stringify(action.payload));
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
    },
});

export const { searchPosts, getPosts,newPost, editPost, deletePost } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;

export default postsSlice.reducer;