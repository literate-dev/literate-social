import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './slices/modalSlice'
import authSlice from './slices/authSlice'

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
