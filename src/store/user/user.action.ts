import { USER_ACTION_TYPES } from './user.types'
import { createAction, withMatcher, ActionWithPayload } from "../../utils/reducer/reducer.utils";
import { UserData } from '../../utils/firebase/firebase.utils'

export type SetCurrentUser = ActionWithPayload<USER_ACTION_TYPES.SET_CURRENT_USER, UserData>;

export type SetUserData = ActionWithPayload<USER_ACTION_TYPES.SET_USER_DATA, UserData>;

export type SetSignUpLoading = ActionWithPayload<USER_ACTION_TYPES.SET_SIGN_UP_LOADING, boolean>;

export const setCurrentUser = withMatcher((user: UserData): SetCurrentUser => 
	createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user));

export const setUserData = withMatcher((userData: UserData): SetUserData => 
	createAction(USER_ACTION_TYPES.SET_USER_DATA, userData));

export const setSignUpLoading = withMatcher((loading: boolean): SetSignUpLoading => 
	createAction(USER_ACTION_TYPES.SET_SIGN_UP_LOADING, loading));

