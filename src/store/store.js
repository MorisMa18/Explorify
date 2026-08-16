import { configureStore } from "@reduxjs/toolkit";

import songReducer from "./songSlice";

export default configureStore({
  reducer: {
    song: songReducer,
  },
});
