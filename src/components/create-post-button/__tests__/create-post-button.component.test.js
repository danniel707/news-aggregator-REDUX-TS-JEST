import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import CreatePostButton from '../create-post-button.component';
import * as firebaseUtils from '../../../utils/firebase/firebase.utils'; // Import firebase utils
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';

// Set the app element for react-modal
Modal.setAppElement(document.createElement('div'));

// Mock useSelector
jest.mock('react-redux', () => ({   
  useDispatch: jest.fn(),
}));


describe('CreatePostButton component', () => {
  
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should open the modal when "Create Post" button is clicked', async () => {
    const { getByRole } = render(<CreatePostButton />);
    const createPostButton = getByRole('button');

    fireEvent.click(createPostButton);

  });

  test('should display success message after creating a post', async () => {
   
    const mockCreatePostDocument = jest.spyOn(firebaseUtils, 'createPostDocument');

    const mockNewPost = {
      title: 'Test Title',
      url: 'https://example.com',
      description: 'Test Description',
      createdAt: Date.now(),
    };

    mockCreatePostDocument.mockResolvedValue(mockNewPost);
    
    const { getByText, queryByText, getByLabelText } = render(<CreatePostButton />);
    const createPostButton = getByText('Create Post');
    
    fireEvent.click(createPostButton); // Open modal

    //createPostDocument.mockResolvedValue(mockNewPost);

     // Fill in the form fields
    fireEvent.change(getByLabelText('Title'), { target: { value: mockNewPost.title } });
    fireEvent.change(getByLabelText('URL'), { target: { value: mockNewPost.url } });
    fireEvent.change(getByLabelText('Description'), { target: { value: mockNewPost.description } });

     // Simulate creating a post
    await act(async () => {
      await fireEvent.click(getByText('Create'));
    });

    // Ensure success message is displayed
    expect(getByText('Test Title')).toBeInTheDocument();

  });

});
