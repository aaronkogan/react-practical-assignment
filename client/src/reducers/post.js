import { createSlice  } from "@reduxjs/toolkit";

const initialState = {
    query: {id: 0, event: "firstStart"},
    imgPre: 0
}

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        newPost: (state, action) => {
            state.query = action.payload;
        },
        editPost: (state, action) => {
            state.query = action.payload;
        },
        deletePost: (state, action) => {
            state.query = action.payload;
        },
        preloadPostImg: (state, action) => {
            state.imgPre = action.payload;
        },
        resetEvent: (state, action) => {
            state.query = {id: 0, event: "default"};
        },
        resetPost: (state, action) => {
            Object.assign(state, initialState);
        }
    },
});

export const { newPost, editPost, deletePost, preloadPostImg, resetEvent, resetPost } = postSlice.actions;

export const selectQuery = (state) => state.post.query;

export const selectNewPostImg = (state) => state.post.imgPre;

export default postSlice.reducer;