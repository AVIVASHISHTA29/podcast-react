// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import podcastReducer from "./slices/podcastSlice";
import episodeReducer from "./slices/episodeSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    podcast: podcastReducer,
    episode: episodeReducer,
  },
});
