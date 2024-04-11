import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import configureStore from 'redux-mock-store';
import PostsList from '../posts-list.component';
import { setPosts } from '../../../store/posts/posts.action';
import { deletePost } from '../../../utils/firebase/firebase.utils'

jest.mock('../../../utils/firebase/firebase.utils');
// Mock fetchUser and deletePostComment functions

jest.mock('../../../utils/firebase/firebase.utils', () => ({  
  deletePost: jest.fn(),
}));

describe('PostsList component', () => {
  const mockOnCommentsQuantity = jest.fn();
  
  test('It should render a Spinner while loading', () => {
    // Mock useSelector to return loading as true
  	
    renderWithProviders(<PostsList />, {
      preloadedState: {
        posts: {
          loading: true, 
          posts: []        
        },
      },
    });  
    // Assert that the Spinner component is rendered
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('should render posts when loading is false and there are posts', () => {
        
    renderWithProviders(<PostsList />, {
      preloadedState: {
      	posts: {
      		loading: false,
	        posts: [	      	
	      	 {id: "23r23r2ewrwe", title: "Post1", createdAt: {"seconds": 1708580501,"nanoseconds": 60000000} },
	      	 {id: "56h56h56thh5", title: "Post2", createdAt: {"seconds": 1708580501,"nanoseconds": 60000000} },
	       ],
      	}               
      },
    });

    // Assert that the Spinner component is not rendered
    expect(screen.queryByTestId('spinner')).toBeNull();
    expect(screen.getByText('Post1')).toBeInTheDocument();
    expect(screen.getByText('Post2')).toBeInTheDocument();
  });

  test('should call handlePostDelete when delete button is clicked', async() => {
   
    const mockHandlePostDelete = jest.fn();
    // Render the component with mock Redux store
    renderWithProviders(<PostsList />, {
    	preloadedState: {
	      	posts: {
	      		loading: false,
		        posts: [	      	
		      	 {id: "1", title: "Post1", createdAt: new Date().getTime(), },
		      	 {id: "2", title: "Post2", createdAt: new Date().getTime(), },	      	 
		       ],
	      	},
	      	user: {
	          currentUser: { displayName: 'John Doe' },
	          userData: { displayName: 'John Doe', role:'admin' }
	        },    
	      }, 
	        handlePostDelete: mockHandlePostDelete,          
	    }
	);
   	window.confirm = jest.fn(() => true);
    // Find the delete button for the first post
    const deleteButton = screen.getByTestId('delete-post-1');

    // Simulate a click event on the delete button
    fireEvent.click(deleteButton);
   
    // Assert that the handlePostDelete function is called with the correct parameters
    await waitFor(() => {
      expect(deletePost).toHaveBeenCalledTimes(1);
      expect(deletePost).toHaveBeenCalledWith('1')
      expect(screen.queryByText('Post1')).not.toBeInTheDocument();
      expect(screen.getByText('Post2')).toBeInTheDocument();
    });
  });

    test('should not call render delete and edit button when no user is logged in', async() => {
   
    const mockHandlePostDelete = jest.fn();
    // Render the component with mock Redux store
    renderWithProviders(<PostsList />, {
      preloadedState: {
          posts: {
            loading: false,
            posts: [          
             {id: "1", title: "Post1", createdAt: new Date().getTime(), },
             {id: "2", title: "Post2", createdAt: new Date().getTime(), },           
           ],
          },
          user: {
            currentUser: null,
            userData: null
          },    
        },                    
      }
    );
    
    await waitFor(() => expect(screen.queryByText('edit-post-button')).not.toBeInTheDocument());
 
    // Assert that the handlePostDelete function is called with the correct parameters
    await waitFor(() => expect(screen.queryByText('delete-post-1')).not.toBeInTheDocument());

    });

});





 // it('should not render a Spinner when loading is false', () => {
 //    // Mock useSelector to return loading as false
 //    useSelector.mockReturnValue(false);

 //    // Create a mock store with the desired initial state
 //    const store = mockStore({
 //      posts: [],
 //      loading: false,
 //    });

 //    render(
 //      <Provider store={store}>
 //        <PostsList />
 //      </Provider>
 //    );

 //    // Assert that the Spinner component is not rendered
 //    expect(screen.queryByTestId('spinner')).toBeNull();
 //  });