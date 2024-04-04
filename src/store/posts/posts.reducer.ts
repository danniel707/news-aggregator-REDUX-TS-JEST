import { AnyAction } from 'redux';
import { Post } from './posts.types'
import { setPosts, addPost, updatePost } from './posts.action'

export type PostsState = {
	readonly posts: Post[];
	readonly loading: boolean;
}

export const POSTS_INITIAL_STATE: PostsState = {	
	posts: [], 
	loading: true,
}

export const postsReducer = (
	state = POSTS_INITIAL_STATE, 
	action: AnyAction
	): PostsState => {
	if (setPosts.match(action)){
		return {
			...state,
			posts: action.payload,
			loading: false,
		};
	}
	if (addPost.match(action)){
		return {
			...state,
			posts: [action.payload, ...state.posts]
		};	
	}
	if (updatePost.match(action)){
		return {
			...state,
			posts: state.posts.map((post) =>
	          	post.id === action.payload.postId
	            ? { ...post, ...action.payload.updatedPost }
	            : post
	        ),
		};	
	}
	return state;
}
