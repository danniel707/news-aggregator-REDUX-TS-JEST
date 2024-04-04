import { Routes, Route } from 'react-router-dom'

import Navigation from './routes/navigation/navigation.component'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { onAuthStateChangedListener, fetchUser } from './utils/firebase/firebase.utils'

import Home from './routes/home/home.component';
import Authentication from './routes/authentication/authentication.component'
import { setCurrentUser, setUserData } from './store/user/user.action';
import { selectCurrentUser } from './store/user/user.selector'

const App = () => {
  
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    const unsuscribe = onAuthStateChangedListener((user) => {
      // if(user) {     
      //  createUserDocumentFromAuth(user);      
      // }
     
      dispatch(setCurrentUser(user))
    })
    return unsuscribe
  }, [dispatch]);   

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const fetchedUser = currentUser ? await fetchUser(currentUser.uid) : null;
          dispatch(setUserData(fetchedUser));
        } catch (error) {
          console.error(error);
        }
      }
      fetchUserData();
  }, [currentUser, dispatch]);

  
  return (
    <Routes>      
      <Route path='/' element={<Navigation />}> 
        <Route index element={<Home />} />  
        <Route path='auth' element={<Authentication />} />           
      </Route> 
    </Routes>
  )

}

export default App;
