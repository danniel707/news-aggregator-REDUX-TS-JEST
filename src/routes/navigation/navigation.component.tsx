import { Fragment, FC } from 'react';
import { Outlet, Link } from 'react-router-dom';

import { useSelector } from 'react-redux'
import { selectCurrentUser, selectUserData } from '../../store/user/user.selector'

import { signOutUser } from '../../utils/firebase/firebase.utils';

import './navigation.styles.scss'

const Navigation: FC = () => {
  
  const currentUser = useSelector(selectCurrentUser)
  const userData = useSelector(selectUserData)

  return (
    <Fragment>
      <div className="navigation-container">
        <div className="logo">Logo</div>
        <Link className="nav-link" to='/'>
          <div className="title">News Blog</div>
        </Link>
        <div>
          {currentUser ? (
            <div className="name-sign-out-container">
              {userData ? (<p>{userData.displayName}</p>
              ) : (<p>{currentUser.displayName}</p>)}
              <div className='nav-link nav-right-side sign-out'>
                <span onClick={signOutUser}>Sign Out</span>
              </div>
            </div>
          ) : (
            <Link className='nav-link' to="/auth">
              <div className="nav-right-side sign-in">Log In / Sign In</div>
            </Link>
          )}
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
