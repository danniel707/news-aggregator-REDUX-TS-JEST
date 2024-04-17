import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import PostComments from '../post-comments.component';
import { Post as PostType } from '../../../store/posts/posts.types';
import { getPostCommentsQuantity, getPostLikesQuantity } from '../../../utils/firebase/firebase.utils';
import { useSelector } from 'react-redux';

jest.mock('../../../utils/firebase/firebase.utils');

// Mock useSelector
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

// Mock selectCurrentUser selector
jest.mock('../../../store/user/user.selector', () => ({
  selectCurrentUser: jest.fn(),
}));

describe('PostComments', () => {
  const mockPost: PostType = {
    id: '1',
    title: 'Test Post',      
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the comments button and comments quantity', async () => {
    getPostCommentsQuantity.mockResolvedValue(2);
    const { getByText, getByRole } = render(<PostComments post={mockPost} />);
    const commentsButton = getByRole('button');

    await waitFor(() => {
      expect(getByText(2)).toBeInTheDocument();
      expect(commentsButton).toBeInTheDocument();
    });
  });

  test('should open the comments modal when the comments button is clicked', () => {
    const { getByText, getByRole } = render(<PostComments post={mockPost} />);
    const commentButton = getByRole('button');

    fireEvent.click(commentButton);

    expect(getByText(/Test Post/i)).toBeInTheDocument();///Test Post/i, regular expresion will match "Test Post", "test post", "TEST POST" 
  });

  test('should fetch the comments quantity when the component mounts', async () => {
    render(<PostComments post={mockPost} />);

    await waitFor(() => expect(getPostCommentsQuantity).toHaveBeenCalledWith('1'));
  });

});
