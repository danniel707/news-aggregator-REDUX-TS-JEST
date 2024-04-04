import { useState, useEffect, FC } from 'react';

import { getPostCommentsQuantity } from '../../utils/firebase/firebase.utils'
import { Post as PostType } from '../../store/posts/posts.types';

import CommentsModal from '../comments-modal/comments-modal.component'
import Modal from 'react-modal';

import './post-comments.styles.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const PostComments: FC<{post: PostType}> = ({post}) => {

	const [commentsQuantity, setCommentsQuantity] = useState<number | null>(null);

	const handleCommentsQuantity = (quantity: number) => {
    	setCommentsQuantity(quantity); // Update comments quantity in parent
  	};

  	useEffect(() => {
    	const fetchCommentsQuantity = async () => {
     		try {     		
        	const quantity = post.id ? await getPostCommentsQuantity(post.id) : 0;
        	setCommentsQuantity(quantity);
      		} catch (error) {
        	console.error('Error fetching comments quantity:', error);
      		}
    	};
    	fetchCommentsQuantity();
 	}, [post.id])//The effect will be triggered whenever the value of postId changes.

	const [isPostCommentsModalOpen, setIsPostCommentsModalOpen] = useState(false);
	
	const openPostCommentsModal = () => {
    	setIsPostCommentsModalOpen(true);
  	};

  	const closePostCommentsModal = () => {
    	setIsPostCommentsModalOpen(false);
  	};  

	return (
		<div>
			<button
				className="comments-button"
				onClick={openPostCommentsModal}
			>         		
        		<FontAwesomeIcon icon={faComments} />
      		</button>
      		<Modal
		        isOpen={isPostCommentsModalOpen}
		        onRequestClose={closePostCommentsModal}
		        contentLabel="Post Comments Modal"
      		>
      		<CommentsModal post={post} onCommentsQuantity={handleCommentsQuantity}/>      		
      		</Modal>
      		<span>{commentsQuantity}</span>      		
		</div>
	)
}

export default PostComments;