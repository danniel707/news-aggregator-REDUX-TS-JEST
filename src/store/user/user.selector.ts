import { createSelector } from 'reselect';

import { UserState } from './user.reducer';
import { RootState } from '../store';


const selectUserReducer = (state: RootState): UserState => state.user;

export const selectCurrentUser = createSelector(
	selectUserReducer,
	(userSlice) => userSlice.currentUser
)

export const selectUserData = createSelector(
	selectUserReducer,
	(userSlice) => userSlice.userData
)

export const selectUserLoading = createSelector(
  [selectUserReducer],
  (userSlice) => userSlice.loading
);