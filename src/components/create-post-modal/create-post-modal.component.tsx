import { useState, FC, ChangeEvent, FormEvent  } from 'react';
import { useDispatch } from 'react-redux'

import Button from '../button/button.component'

import { addPost } from '../../store/posts/posts.action';
import { Post } from '../../store/posts/posts.types';

import FormInput from '../form-input/form-input.component'

import { createPostDocument
} from '../../utils/firebase/firebase.utils'

import './create-post-modal.styles.scss'

type Props = {
  onPostCreate: (post: Post) => void;
}

const defaultFormFields: Omit<Post, 'id'> = {
  title: '',
  url: '',
  description: '',
  createdAt: Date.now(),  
}

const CreatePostModal: FC<Props> = ({ onPostCreate }) => {
  const [formFields, setFormFields] = useState<Omit<Post, 'id'>>(defaultFormFields);
  const { title, url, description, createdAt } = formFields;
  const dispatch = useDispatch();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
       const newPostData: Omit<Post, 'id'> = { title, url, description, createdAt };        
       const newPost: Post | undefined = await createPostDocument(newPostData);       
       
       if ( newPost ) {
         dispatch(addPost(newPost));
         onPostCreate(newPost); // Pass the new post to the parent component
       }
       resetFormFields();   
    } catch (error){
      console.error('Error adding post:', error);    
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value})
  };

  return (
    <div className='create-post-container'>
      <h2>Create New Post</h2>      
      <form onSubmit={handleSubmit}>        
        <FormInput 
          label='Title'
          type='text' 
          required 
          onChange={handleChange} 
          name="title" 
          value={title}
        />     
        <FormInput 
          label='URL'
          type='text' 
          required 
          onChange={handleChange} 
          name="url" 
          value={url}
        />    
        <FormInput 
          label='Description'
          type='textarea' 
          required 
          onChange={handleChange} 
          name="description" 
          value={description}
        />      
        <Button buttonType="createPost" type="submit">Create</Button>
      </form>
    </div>
  )
}

export default CreatePostModal;
