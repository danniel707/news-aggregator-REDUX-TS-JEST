import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CreatePostModal from '../create-post-modal.component';
import { useDispatch } from 'react-redux';
import { createPostDocument } from '../../../utils/firebase/firebase.utils';


// Mock useDispatch
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock createPostDocument function
jest.mock('../../../utils/firebase/firebase.utils', () => ({
  createPostDocument: jest.fn(),
}));

describe('CreatePostModal component', () => {
  const mockDispatch = jest.fn();
  const mockOnPostCreate = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders create post modal correctly', () => {
    const { getByText, getByLabelText } = render(<CreatePostModal onPostCreate={mockOnPostCreate} />);
    expect(getByText('Create New Post')).toBeInTheDocument();
    expect(getByLabelText('Title')).toBeInTheDocument();
    expect(getByLabelText('URL')).toBeInTheDocument();
    expect(getByLabelText('Description')).toBeInTheDocument();
    expect(getByText('Create')).toBeInTheDocument();
  });

  test('handles form submission correctly', async () => {
    const mockPostData = {
      title: 'Test Title',
      url: 'https://example.com',
      description: 'Test Description',
      createdAt: Date.now(),
    };
    createPostDocument.mockResolvedValue(mockPostData);

    const { getByLabelText, getByText } = render(<CreatePostModal onPostCreate={mockOnPostCreate} />);

    fireEvent.change(getByLabelText('Title'), { target: { value: mockPostData.title } });
    fireEvent.change(getByLabelText('URL'), { target: { value: mockPostData.url } });
    fireEvent.change(getByLabelText('Description'), { target: { value: mockPostData.description } });

    fireEvent.submit(getByText('Create'));

    await waitFor(() => {
      expect(createPostDocument).toHaveBeenCalledWith({
        title: mockPostData.title,
        url: mockPostData.url,
        description: mockPostData.description,
        createdAt: expect.any(Number),
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'posts/ADD_POST',
        payload: {
          title: 'Test Title',
          url: 'https://example.com',
          description: 'Test Description',
          createdAt: expect.any(Number),
        },
      });
      expect(mockOnPostCreate).toHaveBeenCalledWith(mockPostData);
    });
  });

});
