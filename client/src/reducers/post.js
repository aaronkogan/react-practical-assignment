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
            console.warn("Redux newPost: "+ JSON.stringify(state.query))
        },
        editPost: (state, action) => {
            state.query = action.payload;
            console.warn("Redux editPost: "+ JSON.stringify(state.query))
        },
        deletePost: (state, action) => {
            state.query = action.payload;
            console.warn("Redux deletePost: "+ JSON.stringify(state.query))
        },
        preloadPostImg: (state, action) => {
            state.imgPre = action.payload;
        }
    },
});

export const { newPost, editPost, deletePost, preloadPostImg } = postSlice.actions;

export const selectQuery = (state) => state.post.query;

export const selectNewPostImg = (state) => state.post.imgPre;

export default postSlice.reducer;