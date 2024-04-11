import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import Post from '../post.component';
import { useSelector, useDispatch } from 'react-redux';
import { fetchIfPostLiked, 
         getPostCommentsQuantity,
         getPostLikesQuantity,
         deletePost } from '../../../utils/firebase/firebase.utils';
import Modal from 'react-modal';

// Set the app element for react-modal
Modal.setAppElement(document.createElement('div'));

// Mock useDispatch
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../utils/firebase/firebase.utils', () => ({
  fetchIfPostLiked: jest.fn(), 
  getPostLikesQuantity: jest.fn(),
  getPostCommentsQuantity: jest.fn(),
  deletePost: jest.fn(),
}));

// Mock selectCurrentUser selector
jest.mock('../../../store/user/user.selector', () => ({
  selectCurrentUser: jest.fn(),
}));

describe('Post component', () => {
  const mockCurrentUser = { uid: 'user1' };
  const mockUserData = { displayName: 'John Doe', role:'admin' }
  const mockDispatch = jest.fn();
  
  beforeEach(() => {
    useSelector.mockReturnValue(mockCurrentUser);
    useSelector.mockReturnValue(mockUserData);
    useDispatch.mockReturnValue(mockDispatch);
    fetchIfPostLiked.mockResolvedValue(false);
    getPostLikesQuantity.mockResolvedValue(0);
    getPostCommentsQuantity.mockResolvedValue(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPost = {
    id: '1',
    title: 'Test Post Title',
    url: 'https://example.com',
    description: 'Test post description',
    createdAt: Date.now(),
  };

  const mockOnPostDelete = jest.fn();

  test('renders post details correctly', () => {

    const { getByText } = render(<Post post={mockPost} onPostDelete={mockOnPostDelete} />);
    
    expect(getByText('Test Post Title')).toBeInTheDocument();
    expect(getByText('Test post description')).toBeInTheDocument();
    expect(getByText('less than a minute ago')).toBeInTheDocument(); // Assuming the "about" text is always present for time ago
  });

  test('opens edit post modal when "Edit" button is clicked', () => {
    const { getByText, getByTestId } = render(<Post post={mockPost} onPostDelete={mockOnPostDelete} />);
    
    const editButton = getByTestId ('edit-post-button-1'); 
    fireEvent.click(editButton);
   
    expect(getByText('Edit Post')).toBeInTheDocument();
  });

  test('calls onPostDelete when "Delete" button is clicked', async () => {
    const { getByTestId } = render(<Post post={mockPost} onPostDelete={mockOnPostDelete} />);
    window.confirm = jest.fn(() => true);
   
    fireEvent.click(getByTestId('delete-post-1'));

    await waitFor(() => expect(mockOnPostDelete).toHaveBeenCalledWith('1'));
  });

  test('Should not render edit and delete button if there is no current user', () => {
    const mockCurrentUser = null;
    useSelector.mockReturnValue(mockCurrentUser); 

    const { queryByText } = render(<Post post={mockPost} onPostDelete={mockOnPostDelete} />);
    
    expect(queryByText('edit-post-button-1')).not.toBeInTheDocument();
    expect(queryByText('delete-post-1')).not.toBeInTheDocument();

  });
});
