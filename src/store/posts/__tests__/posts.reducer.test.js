import {
	postsReducer,
	POSTS_INITIAL_STATE,
} from '../posts.reducer'

import {
	setPosts,
	addPost,
	updatePost
} from '../posts.action'


describe('Post Reducer tests', () => {
	test('setPosts', () => {
		const mockData = [
			{	
				id: 'asdasdasd',
				title: 'Post1',
				URL: 'https://www.url1.com',
				description: 'description1'
			},
			{	
				id: 'rgbrgbrgbg',
				title: 'Post2',
				URL: 'https://www.url2.com',
				description: 'description2'
			},

		]

		const expectedState = {
			...POSTS_INITIAL_STATE,
			loading: false,
			posts: mockData,
		};

		expect(
			postsReducer(
				POSTS_INITIAL_STATE,
				setPosts(mockData)
			)
		).toEqual(expectedState);
	})

	test('addPost', () => {
		const mockPost = {	
	        id: 'new-post-id',
	        title: 'NewPost',
	        URL: 'https://www.urlnew.com',
	        description: 'descriptionNew'
    	};
		
		const expectedState = {
			...POSTS_INITIAL_STATE,			
			posts: [mockPost, ...POSTS_INITIAL_STATE.posts],
		};

		expect(
			postsReducer(
				POSTS_INITIAL_STATE,
				addPost(mockPost)
			)
		).toEqual(expectedState);
	})

	test('updatePost', () => {
		const initialState = {
			...POSTS_INITIAL_STATE,
			posts: [
				{ id: '1', title:'Post1'},
				{ id: '2', title:'Post2'}
			]		       
    	};
		
		const action = updatePost('2', { title: 'Updated Post' });

		const expectedState = {
			...initialState,			
			posts: [{ id: '1', title: 'Post1' },
        			{ id: '2', title: 'Updated Post' },
        	],
		};

		expect(
			postsReducer(
				initialState,
				action
			)
		).toEqual(expectedState);
	})
})