import { FC, useState, useEffect } from 'react';

import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/user/user.selector'
import { Post as PostType } from '../../store/posts/posts.types';
import { fetchIfPostLiked, sumLike, getPostLikesQuantity } from '../../utils/firebase/firebase.utils';

import './like-button.styles.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';


const LikeButton: FC<{post: PostType}>  = ({ post }) => {
  
  const currentUser = useSelector(selectCurrentUser) 
  const [liked, setLiked] = useState<boolean>(false);
  const [likesQuantity, setLikesQuantity] = useState<number | null>(null);
     
  //Call the function once when the component mounts.
  //Avoid creating a new function every time the component renders
  useEffect(() => {    
    const fetchLikesInfo  = async () => {
      try {
        if (currentUser) {      
          const fields = { postId: post.id, userId: currentUser.uid };
          const isLiked = await fetchIfPostLiked(fields);
          setLiked(isLiked);
        } 
        const quantity = await getPostLikesQuantity(post.id);         
        setLikesQuantity(quantity);    
                    
      } catch (error) {
        console.error('Error checking Likes info:', error);
      }
    };
    fetchLikesInfo ();    
  }, [currentUser, post]);  
   
  const handleLike = async () => {
  try {
      if (!currentUser) {
        alert('Please log in to give a like.');
        return;
      }

      // Optimistic UI Update: Update the UI immediately
      let newLikesQuantity = likesQuantity || 0;
      if (!liked) {
        newLikesQuantity += 1;
      } else {
        newLikesQuantity -= 1;
      }

      setLiked(prevLiked => !prevLiked);
      setLikesQuantity(newLikesQuantity);

      // Send the like/unlike request to the server
      const fields = { postId: post.id, userId: currentUser.uid };
      await sumLike(liked, fields); 

    } catch (error) {
      console.error('Error liking post:', error);
      alert('An error occurred. Please try again later.');

      // Revert the UI changes in case of an error
      setLiked(liked);
      setLikesQuantity(likesQuantity);
    }
  };


  return (
    <div className="like-container">
      <button 
        onClick={handleLike}
        className={classNames('like-button', { 'liked': liked })}>
        <FontAwesomeIcon icon={faThumbsUp} />
      </button>
      <span>{likesQuantity}</span>
    </div>
  );
};

export default LikeButton;
