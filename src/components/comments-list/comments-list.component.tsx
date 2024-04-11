import { useState, useEffect, FC } from 'react';

import { useSelector } from 'react-redux'
import { selectUserData } from '../../store/user/user.selector'

import { Timestamp } from 'firebase/firestore';

import { fetchUser, deletePostComment, UserData, CommentFields } from '../../utils/firebase/firebase.utils'

import Button from '../button/button.component'

import './comments-list.styles.scss'

import { formatDistanceToNow } from 'date-fns';


type CommentsInfoType = {
  comment: CommentFields;
  displayName: string;
  hoursAgo: string;
}

type Props = {
  currentUser: UserData | null;
  comments: CommentFields[];
  onCommentsQuantity: (quantity: number) => void;
}

const CommentsList: FC<Props> = ({ currentUser, comments, onCommentsQuantity }) => {

  const [commentsInfo, setCommentsInfo] = useState<CommentsInfoType[]>([]);
  const userData = useSelector(selectUserData)
 
  useEffect(() => {
    const fetchUsersnames = async () => {
      try {//throws the error until finishing the loop
        const updatedCommentsInfo = comments ? await Promise.all(comments.map(async (comment) => {
          let date: Date;
          let hoursAgo: string = 'N.A';
          // Check if post.createdAt is a number or a Timestamp
          if (typeof comment.createdAt === 'number') {
              // If it's a number, convert it to a Timestamp first
              const timestamp = Timestamp.fromMillis(comment.createdAt);
              date = timestamp.toDate();
          } else {
            // Assuming it's a Timestamp
              const timestamp = comment.createdAt as Timestamp;
              date = new Date(timestamp.seconds*1000 + timestamp.nanoseconds/100000) 
          }
          if (date !== null) {
            hoursAgo = (formatDistanceToNow(date)).replace('about', '') + ' ago'  
          } 
       
          const user = await fetchUser(comment.userId);
         
          return { comment, displayName: user?.displayName, hoursAgo: hoursAgo };
         
        })) : [];
      
        // Update the comments list after processing all comments
        setCommentsInfo(updatedCommentsInfo);
      } catch (error) {
        console.log('Error fetching user names or formatting hours ago: ', error);
      }
    };
    
    fetchUsersnames();
  }, [comments, setCommentsInfo]); // Include setCommentsInfo in the dependency array

   const handleCommentDelete = async (commentId: string) => {
   // Filter out the comment with the given commenttId from the state
    deletePostComment(commentId)
    const updatedCommentsInfo = commentsInfo.filter(commentInfo => commentInfo.comment.id !== commentId);    
    
    // Update the state with the updated posts
    setCommentsInfo(updatedCommentsInfo);   
    onCommentsQuantity(updatedCommentsInfo.length)
  };
 
  return (
    <div className="comments-list-container">  
      <span id="title">Comments</span>
      {(!comments || comments.length === 0) && (
        <div style={{ fontStyle: 'italic', textAlign: 'center' }}>
          No comments yet.
        </div>
      )}
              
      {commentsInfo.map((commentInfo, i) => (
        <div className="comment" key={commentInfo.comment.id} >
          <div>
            <span>{commentInfo.displayName}</span>
            <span className="comment-hours-ago">{commentInfo.hoursAgo}</span>
            <p>{commentInfo.comment.comment}</p>
          </div>
          {currentUser && userData && userData.role === 'admin' && (
            <Button buttonType="deleteComment" onClick={() => handleCommentDelete(commentInfo.comment.id)}>x</Button>
          )}
        </div>
      ))}  
    </div>
  );
}

export default CommentsList;
