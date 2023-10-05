import { createSlice  } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
    query: {id: 0, event: "firstStart"}
}

export const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        newComment: (state, action) => {
            console.warn("REDUX comments newComment: "+ JSON.stringify(action.payload));
            state.query = action.payload;
        },
        editComment: (state, action) => {
            console.warn("REDUX comments editComment: "+ JSON.stringify(action.payload));
            state.query = action.payload;
        },
        deleteComment: (state, action) => {
            console.warn("REDUX comments deleteComment: "+ JSON.stringify(action.payload));
            state.query = action.payload;
        },
        resetCommentsEvent: (state, action) => {
            console.warn("REDUX comments resetCommentsEvent: "+ JSON.stringify(action.payload));
            state.query = {id: 0, event: "default"};
        },
        resetComments: (state, action) => {
            console.warn("REDUX commentsresetComments: "+ JSON.stringify(action.payload));
            Object.assign(state, initialState);
        }
    },
});

export const { newComment, editComent, deleteComment, resetCommentsEvent, resetComments } = commentsSlice.actions;

export const selectCommentsQuery = (state) => state.comments.query;

export default commentsSlice.reducer;