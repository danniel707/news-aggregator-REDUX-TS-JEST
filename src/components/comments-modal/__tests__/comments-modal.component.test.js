import React from 'react';
import { render, fireEvent, waitFor, getByText, getByRole } from '@testing-library/react';
import CommentsModal from '../comments-modal.component';
import { useSelector } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { saveComment, fetchComments, fetchUser } from '../../../utils/firebase/firebase.utils';

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
  fetchUser: jest.fn(),
}));

describe('CommentsModal component', () => {
  const mockPost = { id: 'post1', title: 'Test Post' };
  const mockCurrentUser = { uid: 'user1' };
  const mockUsers = [    
    { userId: 'user2', displayName: 'User 2' },
    { userId: 'user3', displayName: 'User 3' },
  ];
  const mockComments: CommentFields[] = [
    { 
      id: 'comment1',    
      postId: 'post1',
      userId: 'user2',
      comment: 'This is a great post!',
      createdAt: new Date().getTime(),
    },
    {      
      id: 'comment2',
      postId: 'post1',
      userId: 'user3',
      comment: 'I agree with User 2.',
      createdAt: new Date().getTime(),
    },
  ];

  const mockOnCommentsQuantity = jest.fn();

  beforeEach(() => {
    useSelector.mockReturnValue(mockCurrentUser);  
    fetchComments.mockResolvedValue(mockComments);  

    // Mock fetchUser to return different values for different calls
    fetchUser.mockImplementation((userId) => {
      const user = mockUsers.find((user) => user.userId === userId);
      return Promise.resolve(user);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders comments modal correctly', async () => {
  
    const { getByText } = render(<CommentsModal post={mockPost} onCommentsQuantity={mockOnCommentsQuantity} />);
   
    await waitFor(() => {
      expect(fetchComments).toHaveBeenCalledWith(mockPost.id);
      expect(getByText('Test Post')).toBeInTheDocument();
      expect(getByText('This is a great post!')).toBeInTheDocument();
      expect(getByText('I agree with User 2.')).toBeInTheDocument();
    });
  });

  test('should allow the user to submit a comment if they are logged in', async () => {
    const mockComment = 'This is a test comment';
    
    const { getByRole } = render(<CommentsModal post={mockPost} onCommentsQuantity={() => {}} />);
    
    const commentInput = getByRole('textbox');
    const commentButton = getByRole('button');

    act(() => {
      fireEvent.change(commentInput, { target: { value: mockComment } });
    })

    expect(commentButton).not.toBeDisabled();
    
    act(() => {
      fireEvent.click(commentButton);
     })
    
    await waitFor(() => expect(saveComment).toHaveBeenCalled());

    expect(saveComment).toHaveBeenCalledWith({
          comment: mockComment,
          postId: mockPost.id,
          userId: mockCurrentUser.uid,
          createdAt: expect.any(Number),
        });
  });
  
  test('should not allow the user to submit a comment if they are not logged in', async () => {
    useSelector.mockReturnValue(null);
    
    const { getByRole } = render(<CommentsModal post={mockPost} onCommentsQuantity={() => {}} />);
    
    const commentButton = getByRole('button');

    expect(commentButton).toBeDisabled();
    
    act(() => {
      fireEvent.click(commentButton);
    });

    expect(saveComment).not.toHaveBeenCalled();
  });
});
