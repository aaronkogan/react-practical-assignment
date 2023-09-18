import { createSlice  } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: null,
        pageNumber: 1,
        imgPre: 0,
        postId: null
    },
    reducers: {
        searchPosts: (state, action) => {
            state.pageNumber = 1;
            state.posts = action.payload;
        },
        getPosts: (state, action) => {
            state.pageNumber = 1;
            state.posts = action.payload;
        },
        currentPage: (state, action) => {
            state.pageNumber = action.payload;
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
        preloadPostImg: (state, action) => {
            state.imgPre = action.payload;
        },
    },
});

export const { searchPosts, getPosts, currentPage, newPost, editPost, deletePost, preloadPostImg } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;

export const selectPage = (state) => state.posts.pageNumber;

export const selectNewPostImg = (state) => state.posts.imgPre;

export default postsSlice.reducer;