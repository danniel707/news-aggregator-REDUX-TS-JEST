import React from 'react';

import { screen, fireEvent } from '@testing-library/react';
import Navigation from '../navigation.component';
import { renderWithProviders } from '../../../utils/test-utils';
import { signOutUser } from '../../../utils/firebase/firebase.utils';

jest.mock('../../../utils/firebase/firebase.utils', () => ({
  signOutUser: jest.fn(),
}));

describe('Navigation tests', () => {
  test('It should render a Sign In link and not a Sign Out Link if there is no currentUser', () => {
    renderWithProviders(<Navigation />, {
      preloadedState: {
        user: {
          currentUser: null,
        },
      },
    });

    expect(screen.getByText('Log In / Sign In')).toBeInTheDocument();   
    expect(screen.queryByText(/sign out/i)).toBeNull();
  });

  test('It should render Sign Out and not Sign in if there is a currentUser', () => {
    renderWithProviders(<Navigation/>, {
       preloadedState: {
        user: {
          currentUser: {},
        },
      },  
    })

    const signOutLinkElement = screen.getByText(/sign out/i);
    expect(signOutLinkElement).toBeInTheDocument();

    const signInLinkElement = screen.queryByText(/sign in/i);
    expect(signInLinkElement).toBeNull();
  });

  test('It should render the display name if there is a currentUser and userData', () => {
   
    renderWithProviders(<Navigation />, {
       preloadedState: {
        user: {
          currentUser: { displayName: 'John Doe' },
          userData: { displayName: 'John Doe' }
        },
      },  
    })
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  
  })

  test('It should render the display name if there is a currentUser and no userData', () => {
   
    renderWithProviders(<Navigation />, {
       preloadedState: {
        user: {
          currentUser: { displayName: 'John Doe' },                    
        },
      },  
    })
    expect(screen.getByText('John Doe')).toBeInTheDocument();  
  })

  test('It shouldnt render the display name if there is no currentUser', () => {
   
    renderWithProviders(<Navigation />, {
       preloadedState: {
        user: {
          currentUser: null,  
          userData: null       
        },
      },  
    })
    expect(screen.queryByText('John Doe')).toBeNull();  
  })
  
  test('Should call signOutUser when Sign Out is clicked', async () => {
 
    renderWithProviders(<Navigation/>, {
      preloadedState: {
        user: {
          currentUser: {}
        }
      }   
    })
   
    fireEvent.click(screen.getByText('Sign Out'));
    expect(signOutUser).toHaveBeenCalledTimes(1);
  })

   test('should navigate to auth page when Log In / Sign In is clicked', () => {
    renderWithProviders(<Navigation/>, {
      preloadedState: {
        user: {
          currentUser: null,  
          userData: null 
        }
      }   
    })

    fireEvent.click(screen.getByText('Log In / Sign In'));
    expect(window.location.pathname).toBe('/auth');
  });
});
