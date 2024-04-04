import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import configureStore from 'redux-mock-store';
import PostsList from '../posts-list.component';
import { setPosts } from '../../../store/posts/posts.action';

describe('PostsList component', () => {
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
  });

  test('should call handlePostDelete when delete button is clicked', () => {
   
    const mockHandlePostDelete = jest.fn();
    // Render the component with mock Redux store
    renderWithProviders(<PostsList />, {
    	preloadedState: {
	      	posts: {
	      		loading: false,
		        posts: [	      	
		      	 {id: "1", title: "Post1" },
		      	 {id: "2", title: "Post2" },	      	 
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
    expect(mockHandlePostDelete).toHaveBeenCalledWith('1');
  });

  // test('should delete a post when delete button is clicked', () => {
  //   const mockStore = configureStore([]);
  //   // Render the component with mock Redux store
    
  //   const  preloadedState= {
  //     	posts: {
  //     		loading: false,
// 	        posts: [	      	
// 	      	 {id: "1", title: "Post1" },
// 	      	 {id: "2", title: "Post2" },	      	 
// 	       ],
  //     	},
  //     	user: {
  //         currentUser: { displayName: 'John Doe' },
  //         userData: { displayName: 'John Doe', role:'admin' }
  //       },               
  //   }
    
  //   const store = mockStore(preloadedState);
  //   renderWithProviders(<PostsList />, {store});
  //   window.confirm = jest.fn(() => true);
  //   // Find the delete button of a specific post
  //   const deleteButton = screen.getByTestId('delete-post-1');
  //   // Simulate a click on the delete button
   
  //   fireEvent.click(deleteButton);
  //   // Check if the correct action is dispatched
  //   const actions = store.getActions();
  //   expect(actions).toEqual([setPosts([{id: '2', title: 'Post2'}])]);
  // });
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