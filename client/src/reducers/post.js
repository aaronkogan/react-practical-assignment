import { createSlice  } from "@reduxjs/toolkit";

export const postSlice = createSlice({
    name: "post",
    initialState: {
        query: {id: 0, event: "firstStart"},
        imgPre: 0
    },
    reducers: {
        newPost: (state, action) => {
            state.query = action.payload;
        },
        editPost: (state, action) => {
            state.query = action.payload;
            console.warn("Redux editPost: "+ JSON.stringify(state.query))
        },
        deletePost: (state, action) => {
            state.query = action.payload;
        },
        preloadPostImg: (state, action) => {
            state.imgPre = action.payload;
        },
        resetEvent: (state, action) => {
            state.query = {id: 0, event: "default"};
        }
    },
});

export const { newPost, editPost, deletePost, preloadPostImg, resetEvent } = postSlice.actions;

export const selectQuery = (state) => state.post.query;

export const selectNewPostImg = (state) => state.post.imgPre;

export default postSlice.reducer;