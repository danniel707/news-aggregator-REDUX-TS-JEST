import React, { useState, FC } from 'react';
import {Timestamp} from 'firebase/firestore';
import { useSelector } from 'react-redux'
import { selectCurrentUser, selectUserData } from '../../store/user/user.selector'

import PostComments from '../post-comments/post-comments.component'
import EditPostModal from '../edit-post-modal.component';
import Button from '../button/button.component'
import LikeButton from '../like-button/like-button.component';

import { Post as PostType } from '../../store/posts/posts.types'
import { deletePost } from '../../utils/firebase/firebase.utils'

import Modal from 'react-modal';

import './post.styles.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { formatDistanceToNow } from 'date-fns';

type Props = {
	post: PostType;
	onPostDelete: (postId: string) => void;
}

const Post: FC<Props> = ({ post, onPostDelete }) => {
  
	const currentUser = useSelector(selectCurrentUser)
  	const userData = useSelector(selectUserData)	
		
	const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);

	const openEditPostModal = () => {
    	setIsEditPostModalOpen(true);
  	};

  	const closeEditPostModal = () => {
    	setIsEditPostModalOpen(false);
  	};

  	const handlePostEdit = () => {
  		 setIsEditPostModalOpen(false);  	
  	}

	const handleDelete = async () => {
		const confirmDelete = window.confirm('Are you sure you want to delete this post?');

	    if (confirmDelete) {
	        try {
	            await deletePost(post.id);
	            onPostDelete(post.id);
	        } catch (error) {
	            console.error('Error deleting post:', error);
	        }
	    }
	}

	const webSite = post.url ? post.url.split('https://').pop()?.split('/')[0] : '';
	const webSource = webSite ? webSite.replace('www.', '') : '';

	let date: Date;
	let hoursAgo: string = 'N.A';
	// Check if post.createdAt is a number or a Timestamp
	if (typeof post.createdAt === 'number') {
	    // If it's a number, convert it to a Timestamp first
	    const timestamp = Timestamp.fromMillis(post.createdAt);
	    date = timestamp.toDate();
	} else {
    // Assuming it's a Timestamp
	    const timestamp = post.createdAt as Timestamp;
	    date = new Date(timestamp.seconds*1000 + timestamp.nanoseconds/100000) 
	}
	if (date !== null) {
		hoursAgo = (formatDistanceToNow(date)).replace('about', '') + ' ago'	
	} 

	return (
		<div className="post-container">			
			<div className="post-content">
				<a href={`${post.url}`} target="_blank" rel="noopener noreferrer">			
					<div  className="post-title">
						<span>{post.title}</span>
					</div>
				</a>
				<div className="post-source">
					<img src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${webSite}&size=16`} alt={webSite} />
						<span>{webSource}</span>	
					</div>
				<div className="post-description">
					<p>{post.description}</p>
				</div>
				<div className="post-bottom-container">	
					<div className="hours-ago">
						<span>{hoursAgo} </span>
					</div>		
					<div className="post-bottom-right-side">									
						<LikeButton post={post}/>
						<PostComments post={post}/>						
					</div>					
				</div>		
			</div>
			{currentUser && userData && userData.role === 'admin' && (
				<div className="post-tools">												
					<button className="edit-post-button"						
						onClick={openEditPostModal}
					>         		
		        	<FontAwesomeIcon icon={faEdit} />
		      		</button>
		      		<Modal
				        isOpen={isEditPostModalOpen}
				        onRequestClose={closeEditPostModal}
				        contentLabel="Edit Post Modal"
		      		>
		      		<EditPostModal post={post} onPostEdit={handlePostEdit} />		      		     		
		      		</Modal>
		      		<div className="delete-post-button-container">
						<Button buttonType='deletePost' onClick={handleDelete} data-testid={`delete-post-${post.id}`}>X</Button>
					</div>	
			      </div>		      	
			)}
		</div>
	)
}

export default Post;