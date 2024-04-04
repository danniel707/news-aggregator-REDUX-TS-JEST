import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button, { BUTTON_TYPE_CLASSES } from '../button.component'

describe('Button component', () => {
  test('should render base button with children', () => {
    const { getByText } = render(<Button buttonType="base">Click me</Button>);
    const button = getByText('Click me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(BUTTON_TYPE_CLASSES.base);
  });

  test('should render Google sign-in button', () => {
    const { getByText } = render(<Button buttonType="google">Sign in with Google</Button>);
    const button = getByText('Sign in with Google');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(BUTTON_TYPE_CLASSES.google);
  });

  test('should call onClick handler when clicked', () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <Button buttonType="base" onClick={onClickMock}>
        Click me
      </Button>
    );
    const button = getByText('Click me');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });

});
