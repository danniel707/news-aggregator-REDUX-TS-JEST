import { useState, useEffect, FC, FormEvent, ChangeEvent } from 'react';
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '../../store/user/user.selector'
import { Post } from '../../store/posts/posts.types';

import { saveComment, fetchComments, CommentFields } from '../../utils/firebase/firebase.utils'

import Button from '../button/button.component'
import CommentsList from '../comments-list/comments-list.component'

import FormInput from '../form-input/form-input.component'

import './comments-modal.styles.scss'

type Props = {
  post: Post;
  onCommentsQuantity: (length: number) => void; 
}

const defaultFormFields: Omit<CommentFields, 'id'> = {
  postId: '',
  userId: '',
	comment: '',
	createdAt: Date.now(),   
}

const CommentsModal: FC<Props> = ({ post, onCommentsQuantity }) => {
  const [formFields, setFormFields] = useState<Omit<CommentFields, 'id'>>(defaultFormFields);
  const { comment, createdAt } = formFields;
  const currentUser = useSelector(selectCurrentUser)
  const [ comments, setComments ] = useState<CommentFields[]>([]);

  useEffect(() => {
    const fetchCommentsData = async () => {
      const commentsData: CommentFields[] = post.id ? await fetchComments(post.id) : [];      
      setComments(commentsData);
    };
    fetchCommentsData();
  }, [post.id]);
  
  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  }

  const handleClick = async () => {
    if (!currentUser) {
      alert('Please log in to leave a comment.'); // Display a message if user is not logged in
      return;
    }   
  }
 
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
   
    try {
       const fields:  Omit<CommentFields, 'id'> = { userId: currentUser?.uid ?? '', postId: post.id, comment: comment, createdAt: createdAt };           
       const newComment = await saveComment(fields);       
  	   // Update comments state with the newly added comment
       setComments(prevComments => [newComment, ...prevComments]);      
  	   onCommentsQuantity(comments.length+1)
       resetFormFields();
    } catch (error){
      console.error('Error adding post:', error);    
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value})
  };

  const handleCommentsQuantity = (quantity: number) => {
    onCommentsQuantity(quantity)    
  }

  return (
    <div className='comments-modal'>
      <h2>{post.title}</h2>      
      <form onSubmit={handleSubmit}>        
        <FormInput 
          label='Comment'
          type='textarea' 
          required 
          onClick={handleClick} 
          placeholder='Write a comment...'
          onChange={handleChange} 
          name="comment" 
          id="comment"
          value={comment}
        />     
        <div className="comment-button-container"> 
        	{currentUser ? (
            <Button buttonType="sendComment" type="submit">Comment</Button>
          ) : (
            <Button buttonType="sendComment" type="submit" disabled>Comment</Button>
          )}      	</div>
      </form>
      	<CommentsList            
          currentUser={currentUser} 
          comments={comments}
          onCommentsQuantity={handleCommentsQuantity}         
          />
      
    </div>
  )
}

export default CommentsModal;
