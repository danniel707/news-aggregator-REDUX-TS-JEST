import { POSTS_ACTION_TYPES, Post } from './posts.types'
import { createAction, ActionWithPayload, withMatcher } from "../../utils/reducer/reducer.utils";

export type SetPosts = ActionWithPayload<POSTS_ACTION_TYPES.SET_POSTS, Post[]>

export type AddPost = ActionWithPayload<POSTS_ACTION_TYPES.ADD_POST, Post>

export type UpdatePost = ActionWithPayload<POSTS_ACTION_TYPES.UPDATE_POST, { postId: string, updatedPost: Post }>


export const setPosts = withMatcher((posts: Post[]): SetPosts =>  
	createAction(POSTS_ACTION_TYPES.SET_POSTS, posts));

export const addPost = withMatcher((newPost: Post): AddPost => {
    return createAction(POSTS_ACTION_TYPES.ADD_POST, newPost);
    });

export const updatePost = withMatcher((postId: string, updatedPost: Post): UpdatePost => {
    return createAction(POSTS_ACTION_TYPES.UPDATE_POST, {postId, updatedPost});
});