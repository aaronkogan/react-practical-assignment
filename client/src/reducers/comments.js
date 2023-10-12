import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    query: { id: 0, event: "firstStart" }
}

export const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        newComment: (state, action) => {
            state.query = action.payload;
        },
        editComment: (state, action) => {
            state.query = action.payload;
        },
        deleteComment: (state, action) => {
            state.query = action.payload;
        },
        resetCommentsEvent: (state, action) => {
            state.query = { id: 0, event: "default" };
        },
        hideCommentsEvent: (state, action) => {
            state.query = { event: "hideComments" };
        },
        resetComments: (state, action) => {
            Object.assign(state, initialState);
        }
    },
});

export const { newComment, editComment, deleteComment, resetCommentsEvent, hideCommentsEvent, resetComments } = commentsSlice.actions;

export const selectCommentsQuery = (state) => state.comments.query;

export default commentsSlice.reducer;