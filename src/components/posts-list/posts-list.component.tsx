import React, { useState, FC } from 'react';

import { useDispatch, useSelector } from 'react-redux'

import { selectPosts, selectPostsLoading } from '../../store/posts/posts.selector'
import { setPosts } from '../../store/posts/posts.action'

import Post from '../post/post.component';
import Spinner from '../spinner/spinner.component'

import './posts-list.styles.scss'


const PostsList: FC = () => {

  const posts = useSelector(selectPosts)  
  const loading = useSelector(selectPostsLoading) 
  const dispatch = useDispatch();
 
  const postsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = Array.isArray(posts) ? posts.slice(startIndex, endIndex) : [];
  const totalPages = posts ? Math.ceil(posts.length / postsPerPage) : 0;
  
  const handlePageChange = (newPage: number) => {
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    
    setCurrentPage(newPage);                    
  };    
 
  const handlePostDelete = async (postId: string) => {
   // Filter out the post with the given postId from the state
    const updatedPosts = posts.filter(post => post.id !== postId);
    
    // Update the state with the updated posts
    dispatch(setPosts(updatedPosts));
  };

  return (
   
    <div className="posts-list-column">
      {loading ? (
        <Spinner /> // Display spinner while loading
      ) : (
        <>
          {(!posts || posts.length === 0) && ( // Check if posts is empty or not provided
            <div style={{ fontStyle: 'italic', textAlign: 'center' }}>
              No posts available.
            </div>
          )}
          {currentPosts.map((post, i) => (
            <Post key={i} post={post} onPostDelete={handlePostDelete} />
          ))}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PostsList;
