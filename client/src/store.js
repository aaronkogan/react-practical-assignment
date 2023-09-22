import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import postsReducer from "./reducers/posts";
import postReducer from "./reducers/post";

export default configureStore({
    reducer: {
        user: userReducer,
        posts: postsReducer,
        post: postReducer,
    },
});