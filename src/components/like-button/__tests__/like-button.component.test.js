import React from 'react';
import { act } from 'react-dom/test-utils'; // Import act function
import { render, fireEvent, waitFor } from '@testing-library/react';
import LikeButton from '../like-button.component';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/user/user.selector';

import { 
  fetchIfPostLiked, 
  sumLike, 
  getPostLikesQuantity } from '../../../utils/firebase/firebase.utils';

// Mocking react-redux useSelector
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

// Mocking user selector
jest.mock('../../../store/user/user.selector', () => ({
  selectCurrentUser: jest.fn(),
}));

// Mocking firebase functions
jest.mock('../../../utils/firebase/firebase.utils', () => ({
  fetchIfPostLiked: jest.fn(),
  sumLike: jest.fn(),
  getPostLikesQuantity: jest.fn(),
}));

describe('LikeButton component', () => {
  const mockPost = { id: 'post1' };
  const mockUser = { uid: 'user1' };

  beforeEach(() => {
    useSelector.mockReturnValue(mockUser);
    fetchIfPostLiked.mockResolvedValue(false);    
    getPostLikesQuantity.mockResolvedValue(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with initial state', async () => {
      
    const { findByText } = render(<LikeButton post={mockPost} />);
    const likesQuantityElement = await findByText('0');
    expect(likesQuantityElement).toBeInTheDocument();

  });

  test('handles like button click', async () => {       

    const { getByRole, getByText } = render(<LikeButton post={mockPost} />);
    const likeButton = getByRole('button');
    // Initial state check
    expect(likeButton).toBeInTheDocument();

    //Gives a like
    fireEvent.click(likeButton);
    
    await waitFor(() => {
      // Check if sumLike function is called with correct parameters
      expect(sumLike).toHaveBeenCalledWith(false, { postId: mockPost.id, userId: mockUser.uid });
      
    });
      // Check if the UI updates optimistically
    expect(likeButton).toHaveClass('liked');
    const likesQuantityElement = await getByText('1');
    expect(likesQuantityElement).toBeInTheDocument(); 
 
  });

  test('handles like button click when user is not logged in', async () => {
   
    const mockUser = null;
    const mockAlert = jest.fn(); // Mock alert function

    useSelector.mockReturnValue(mockUser);
    jest.spyOn(global, 'alert').mockImplementation(mockAlert);

    const { findByText, getByRole } = render(<LikeButton post={mockPost} />);
    const likeButton = getByRole('button');
    // Initial state check
    expect(likeButton).toBeInTheDocument();

    // Click like button
    fireEvent.click(likeButton);

    // Expect alert to be called
    expect(mockAlert).toHaveBeenCalledWith('Please log in to give a like.');
    expect(likeButton).not.toHaveClass('liked');
    const likesQuantityElement2 = await findByText('0');
    expect(likesQuantityElement2).toBeInTheDocument();
  }) ;


});