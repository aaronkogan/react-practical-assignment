import { createSlice  } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: null,
        pageNumber: 1
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
        }
    },
});

export const { searchPosts, getPosts, currentPage } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;

export const selectPage = (state) => state.posts.pageNumber;

export default postsSlice.reducer;