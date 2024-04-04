import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';
import Footer from '../../components/footer/footer.component';
import Spinner from '../../components/spinner/spinner.component'

import { selectUserLoading } from '../../store/user/user.selector'
import { FC } from 'react'
import { useSelector } from 'react-redux'

import './authentication.styles.scss'

const Authentication: FC = () => {
	const loading: boolean = useSelector(selectUserLoading) 
 
	return (
		<div>
			{loading ? (
			<div>
	        	<Spinner />
	      	</div>
	      	) : (
	      	<>
				<div className='authentication-container'>			
					<SignInForm />
					<SignUpForm />				
				</div>
				<Footer /> 
			</>
			)}			
		</div>
	)
}

export default Authentication;