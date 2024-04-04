import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import CommentsList from '../comments-list.component';
import { CommentFields, UserData } from '../../../utils/firebase/firebase.utils';
import { act } from 'react-dom/test-utils';
import { useSelector } from 'react-redux';
import { fetchUser, deletePostComment } from '../../../utils/firebase/firebase.utils'


jest.mock('../../../utils/firebase/firebase.utils');

//Mock useSelector
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
})); 

// Mock fetchUser and deletePostComment functions
jest.mock('../../../utils/firebase/firebase.utils', () => ({
  fetchUser: jest.fn(),
  deletePostComment: jest.fn(),
}));

describe('CommentsList', () => {
  const mockCurrentUser = {
    uid: 'user1',
    displayName: 'User 1',
    email: 'user1@example.com',    
  };

  const mockUserData: UserData[] = {
    uid: 'user1',    
    displayName: 'User 1',
    email: 'user1@example.com',  
    createdAt: new Date().getTime(), 
    role: 'admin' 
  }

  const mockComments: CommentFields[] = [
    {
      id: 'comment1',
      userId: 'user2',
      comment: 'This is a great post!',
      createdAt: new Date().getTime(),
    },
    {
      id: 'comment2',
      userId: 'user3',
      comment: 'I agree with User 2.',
      createdAt: new Date().getTime(),
    },
  ];

  const mockOnCommentsQuantity = jest.fn();

  beforeEach(() => {
     useSelector.mockReturnValue(mockUserData);    
  });

  afterEach(() => {
     jest.clearAllMocks();
  });

  test('should render the comments list with no comments', () => {
    render(<CommentsList currentUser={mockCurrentUser} comments={[]} onCommentsQuantity={mockOnCommentsQuantity} />);

    expect(screen.getByText('No comments yet.')).toBeInTheDocument();
  });

  test('should render the comments list with comments', async () => {
   
    const { getByText } = render(<CommentsList currentUser={mockCurrentUser} comments={mockComments} onCommentsQuantity={mockOnCommentsQuantity} />);

    await waitFor(() => {              
      expect(screen.getByText('This is a great post!')).toBeInTheDocument();
      expect(screen.getByText('I agree with User 2.')).toBeInTheDocument();

    });
    
  });

  test('should delete a comment and update the comments list', async () => {
   
    const { rerender } = render(<CommentsList currentUser={mockCurrentUser} comments={mockComments} onCommentsQuantity={mockOnCommentsQuantity} />);

    await waitFor(() => {              
      expect(screen.getByText('This is a great post!')).toBeInTheDocument();
      expect(screen.getByText('I agree with User 2.')).toBeInTheDocument();

    });
    const deleteButton = screen.getAllByText('x')[0]; 
    fireEvent.click(deleteButton); 

    await act(async () => {
       await new Promise(resolve => setTimeout(resolve));
       rerender(<CommentsList currentUser={mockCurrentUser} comments={[mockComments[1]]} onCommentsQuantity={mockOnCommentsQuantity} />);
     });

    expect(deletePostComment).toHaveBeenCalledTimes(1);
    expect(deletePostComment).toHaveBeenCalledWith(mockComments[0].id);
    expect(screen.queryByText('This is a great post!')).not.toBeInTheDocument();
    expect(screen.getByText('I agree with User 2.')).toBeInTheDocument();
   
  });

});
