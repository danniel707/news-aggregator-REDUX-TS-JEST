import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import EditPostModal from '../edit-post-modal.component';
import { editPostDocument } from '../../../utils/firebase/firebase.utils';

import { useDispatch } from 'react-redux';

// Mock useSelector
jest.mock('react-redux', () => ({   
  useDispatch: jest.fn(),
}));

// Mock createPostDocument function
jest.mock('../../../utils/firebase/firebase.utils', () => ({
  editPostDocument: jest.fn(),
}));

describe('EditPostModal component', () => {

  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update post and trigger onPostEdit callback', async () => {
   
    // Mock post data
    const post = {
      id: '1',
      title: 'Old Title',
      url: 'https://oldurl.com',
      description: 'Old Description',
    };

    const newPost = {
      id: '1',
      title: 'New Title',
      url: 'https://newurl.com',
      description: 'New Description',
    };

    editPostDocument.mockResolvedValue(newPost);
    const mockOnPostEdit = jest.fn();
    // Render the component
    const { getByLabelText, getByText } = render(<EditPostModal post={post} onPostEdit={mockOnPostEdit} />);

    // Update form fields    
    fireEvent.change(getByLabelText('Title'), { target: { value: 'New Title' } });
    fireEvent.change(getByLabelText('URL'), { target: { value: 'https://newurl.com' } });
    fireEvent.change(getByLabelText('Description'), { target: { value: 'New Description' } });

    // Submit the form
    fireEvent.submit(getByText('Save'));

    // Wait for the post to be updated and the onPostEdit callback to be called
    await waitFor(() => {
      expect(mockOnPostEdit).toHaveBeenCalledTimes(1);
    });

  });
});
