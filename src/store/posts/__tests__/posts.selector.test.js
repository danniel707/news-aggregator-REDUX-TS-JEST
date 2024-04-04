import {
	selectPosts,
	selectPostsLoading,	
} from '../posts.selector';

const mockState = {
	posts: {
		loading: false,
		posts: [
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
	}
};

describe('Posts Selector', () => {
	test('selectPosts should return the posts data', () => {
		const postsSlice = selectPosts(mockState);
		expect(postsSlice).toEqual(mockState.posts.posts)
	})

	test('selectPostsLoading should return loading state', () => {
		const loading = selectPostsLoading(mockState);
		expect(loading).toEqual(false);
	})
})