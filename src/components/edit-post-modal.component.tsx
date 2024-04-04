import { useState, FC, ChangeEvent, FormEvent  } from 'react';

import Button from './button/button.component'

import { updatePost } from '../store/posts/posts.action';
import { Post as PostType } from '../store/posts/posts.types';

import FormInput from './form-input/form-input.component'
import { useDispatch } from 'react-redux'

import { editPostDocument
} from '../utils/firebase/firebase.utils'

type EditPostModalProps = {
  post: PostType;
  onPostEdit: () => void;
} 

const EditPostModal: FC<EditPostModalProps> = ({ post, onPostEdit }) => {
  
  const [formFields, setFormFields] = useState<PostType>(post);
  
  const dispatch = useDispatch();  
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {               
       const updatedPost = await editPostDocument(formFields);       
       dispatch(updatePost(post.id, updatedPost!));
       onPostEdit()
      
    } catch (error){
      console.error('Error saving  post:', error);    
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value})
  };

  return (
    <div className='create-post-container'>
      <h2>Edit Post</h2>      
      <form onSubmit={handleSubmit}>        
        <FormInput 
          label='Title'
          type='text' 
          required 
          onChange={handleChange} 
          name="title" 
          value={formFields.title}
        />     
        <FormInput 
          label='URL'
          type='text' 
          required 
          onChange={handleChange} 
          name="url" 
          value={formFields.url}
        />    
        <FormInput 
          label='Description'
          type='textarea' 
          required 
          onChange={handleChange} 
          name="description" 
          value={formFields.description}
        />      
        <Button buttonType="createPost" type="submit">Save</Button>
      </form>
    </div>
  )
}

export default EditPostModal;
