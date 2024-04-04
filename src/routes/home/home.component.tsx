import CreatePostButton from '../../components/create-post-button/create-post-button.component'
import Columns from '../../components/columns/columns.component';
import ScrollTopButton from '../../components/scroll-top-button/scroll-top-button.component';
import Footer from '../../components/footer/footer.component';
import { FC } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser, selectUserData } from '../../store/user/user.selector'


const Home: FC = () => {    
  //Key for left and right column.
  const stockdioKey: string = process.env.REACT_APP_STOCKDIO_API_KEY!;//"!" Non null assertion    
  const currentUser = useSelector(selectCurrentUser)
  const userData = useSelector(selectUserData)
  
  return (
    <div> 
      {currentUser && userData && userData.role === 'admin' && (<CreatePostButton />  )}               
      <Columns stockdioKey={stockdioKey}/>
      <ScrollTopButton />
      <Footer />  
    </div>
  );
}

export default Home;





