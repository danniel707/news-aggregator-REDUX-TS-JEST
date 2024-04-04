import React from 'react';
import * as reactRedux from 'react-redux';

import { screen, fireEvent } from '@testing-library/react';
import Navigation from '../navigation.component';
import { renderWithProviders } from '../../../utils/test-utils';

import { signOutStart } from '../../../store/user/user.action';

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
  
  // test('It should dispatch signOutStart action when clicking on the Sign Out link', async () => {
  //   const mockDispatch = jest.fn();    
    
  //   jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
  //   renderWithProviders(<Navigation/>, {
  //     preloadedState: {
  //       user: {
  //         currentUser: {}
  //       }
  //     }   
  //   })
  //   const signOutLinkElement = screen.getByText(/sign out/i);
  //   expect(signOutLinkElement).toBeInTheDocument();
    
  //   await fireEvent.click(signOutLinkElement);    
  //   expect(mockDispatch).toHaveBeenCalled();

  //   const signOutAction = signOutStart();
  //   expect(mockDispatch).toHaveBeenCalledWith(signOutAction);
  //   mockDispatch.mockClear();
  // })
});
