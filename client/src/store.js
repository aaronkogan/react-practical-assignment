import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import postsReducer from "./reducers/posts";
export default configureStore({
    reducer: {
        user: userReducer,
        posts: postsReducer,
    },
});