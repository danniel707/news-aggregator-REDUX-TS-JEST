import { createSelector } from 'reselect';
import { PostsState } from './posts.reducer';
import { RootState } from '../store';

const selectPostsReducer = (state: RootState): PostsState => state.posts;

export const selectPosts = createSelector(
  [selectPostsReducer],
  (postsSlice) => postsSlice.posts
);

export const selectPostsLoading = createSelector(
  [selectPostsReducer],
  (postsSlice) => postsSlice.loading
);