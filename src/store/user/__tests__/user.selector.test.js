import {
	selectCurrentUser,
	selectUserData,	
	selectUserLoading
} from '../user.selector';

const mockState = {
	user: {
		loading: false,
		currentUser: { id: '1', displayName: 'John Doe' },
		userData: { id: '1', displayName: 'John Doe', email: 'john@email.com', role:'admin'}
		
	}
};

describe('User Selector', () => {
	test('selectCurrentUser should return the current user', () => {
		const userSlice = selectCurrentUser(mockState);
		expect(userSlice).toEqual(mockState.user.currentUser)
	})

	test('selectUserData should return the user data', () => {
		const userSlice = selectUserData(mockState);
		expect(userSlice).toEqual(mockState.user.userData);
	})

	test('selectUserLoading should return the loading state', () => {
		const userSlice = selectUserLoading(mockState);
		expect(userSlice).toEqual(false);
	})
})