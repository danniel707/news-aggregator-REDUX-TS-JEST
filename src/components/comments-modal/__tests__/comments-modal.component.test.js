import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CommentsModal from '../comments-modal.component';
import { useSelector } from 'react-redux';
import { saveComment, fetchComments } from '../../../utils/firebase/firebase.utils';

// Mock useSelector
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

// Mock selectCurrentUser selector
jest.mock('../../../store/user/user.selector', () => ({
  selectCurrentUser: jest.fn(),
}));

// Mock fetchComments and saveComment functions
jest.mock('../../../utils/firebase/firebase.utils', () => ({
  fetchComments: jest.fn(),
  saveComment: jest.fn(),
}));

describe('CommentsModal component', () => {
  const mockPost = { id: 'post1', title: 'Test Post' };
  const mockUser = { uid: 'user1' };
  const mockComments: CommentFields[] = [
    {     
      postId: 'post1',
      userId: 'user2',
      comment: 'This is a great post!',
      createdAt: new Date().getTime(),
    },
    {      
      postId: 'post1',
      userId: 'user3',
      comment: 'I agree with User 2.',
      createdAt: new Date().getTime(),
    },
  ];

  const mockOnCommentsQuantity = jest.fn();

  beforeEach(() => {
    useSelector.mockReturnValue(mockUser);  
    fetchComments.mockResolvedValue(mockComments);  
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders comments modal correctly', async () => {
    
    const { getByText } = render(<CommentsModal post={mockPost} onCommentsQuantity={mockOnCommentsQuantity} />);
    await waitFor(() => getByText('This is a great post!'));
      expect(fetchComments).toHaveBeenCalledWith(mockPost.id);
      expect(getByText('Test Post')).toBeInTheDocument();
      expect(getByText('This is a great post!')).toBeInTheDocument();
      expect(getByText('I agree with User 2.')).toBeInTheDocument();
  });

  test('should allow the user to submit a comment if they are logged in', async () => {
    const mockComment = 'This is a test comment';
    const { getByRole } = render(<CommentsModal post={mockPost} onCommentsQuantity={() => {}} />);
    const commentInput = getByRole('textbox');
    const commentButton = getByRole('button');

    fireEvent.change(commentInput, { target: { value: mockComment } });
    expect(commentButton).not.toBeDisabled();

    fireEvent.click(commentButton);
    await waitFor(() => expect(saveComment).toHaveBeenCalled());

    expect(saveComment).toHaveBeenCalledWith({
          comment: mockComment,
          postId: mockPost.id,
          userId: mockUser.uid,
          createdAt: expect.any(Number),
        });
  });
  
  // test('handles form submission correctly', async () => {
  //   const { getByText, getByPlaceholderText } = render(<CommentsModal post={mockPost} onCommentsQuantity={jest.fn()} />);
  //   const commentInput = getByPlaceholderText('Write a comment...');
  //   fireEvent.change(commentInput, { target: { value: 'New comment' } });
  //   fireEvent.submit(getByText('Comment'));
  //   await waitFor(() => {
  //     expect(saveComment).toHaveBeenCalledWith({
  //       userId: 'user1',
  //       postId: 'post1',
  //       comment: 'New comment',
  //       createdAt: expect.any(Number),
  //     });
  //   });
  // });

  // Additional tests for user interaction, error handling, etc.
});
