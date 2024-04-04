import {
	userReducer,
	INITIAL_STATE,
} from '../user.reducer'

import {
	setCurrentUser,
	setUserData,
	setSignUpLoading
} from '../user.action'


describe('User Reducer tests', () => {
	test('setCurrentUser', () => {
		const currentUser = { id: '123', displayName: 'John Doe', email: 'john@example.com' };
    	const newState = userReducer(undefined, setCurrentUser(currentUser));
    	expect(newState.currentUser).toEqual(currentUser);
	})

	test('setUserData', () => {
		const userData = { id: '123', displayName: 'John Doe', email: 'john@example.com', role: 'user' };
    	const newState = userReducer(undefined, setUserData(userData));
    	expect(newState.userData).toEqual(userData);
	})

	test('setSignUpLoading', () => {
		const loading = true;
    	const newState = userReducer(undefined, setSignUpLoading(loading));
    	expect(newState.loading).toEqual(loading);
	})

	test('should return initial state if action type is not recognized', () => {
	    const initialState = { currentUser: null, userData: null, loading: false, error: null };
	    const newState = userReducer(initialState, { type: 'UNKNOWN_ACTION' });
	    expect(newState).toEqual(initialState);
	 });
})