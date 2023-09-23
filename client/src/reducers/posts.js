import { createSlice  } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: null,
        pageNumber: 1,
        query: ""
    },
    reducers: {
        searchPosts: (state, action) => {
            state.pageNumber = 1;
            state.posts = action.payload;
        },
        searchQuery: (state, action) => {
            console.warn("REDUX search: "+ action.payload)
            state.query = action.payload;
        },
        getPosts: (state, action) => {
            state.posts = action.payload;
        },
        currentPage: (state, action) => {
            state.pageNumber = action.payload;
        }
    },
});

export const { searchPosts, getPosts, currentPage, searchQuery } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;

export const selectPage = (state) => state.posts.pageNumber;

export const selectQuery = (state) => state.posts.query;

export default postsSlice.reducer;