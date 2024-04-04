export enum POSTS_ACTION_TYPES {
	SET_POSTS = "posts/SET_POSTS",
	ADD_POST = "posts/ADD_POST",
	UPDATE_POST = "posts/UPDATE_POST"
}

export type Post = {
	id: string;
	title: string;
	url: string;
	description: string;
	createdAt: number;	
}