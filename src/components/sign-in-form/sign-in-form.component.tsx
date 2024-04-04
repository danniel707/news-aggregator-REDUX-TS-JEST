import { useState, FC, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import FormInput from '../form-input/form-input.component'
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import './sign-in-form.styles.scss'

import { 
	signInWithGooglePopup, 	
	signInAuthUserWithEmailAndPassword
} from '../../utils/firebase/firebase.utils'

type FormFields = {
  email: string;
  password: string;
};

const defaultFormFields = {	
	email: '',
	password: '',
}

const SignInForm: FC = () => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const { email, password } = formFields;

	const navigate = useNavigate(); 

	const resetFormFields = () => {
		setFormFields(defaultFormFields);
	}

	const signInWithGoogle = async () => {
		try {
			await signInWithGooglePopup();		
			// Redirect to the desired page after successful sign-in
			navigate('/');	
			
		} catch (error){
			console.log('user sign in with google failed', error);
						
		}		
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		
		try {			
			const userCredential = await signInAuthUserWithEmailAndPassword(email, password);
			const user = userCredential?.user;
		    
		    if (user) {
		        resetFormFields();
		        // Redirect to the desired page after successful sign-in		       
		        navigate('/');
		    }

		} catch (error){			
			console.log('user sign in failed', error);			
			alert("Incorrect password or email")			
		}
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = event.target;

		setFormFields({...formFields, [name]: value})
	};
	
	return (
		<div className='sign-up-container'>
			<h2>Already have an account?</h2>
			<span>Sign in with email and password or Google account</span>
			<form onSubmit={handleSubmit}>							
				<FormInput 
					label='Email'
					type='email' 
					required 
					onChange={handleChange} 
					name="email" 
					value={email}
				/>
			
				<FormInput 
					label='Password'
					type='password'
					required 
					onChange={handleChange} 
					name="password" 
					value={password}
				/>
				<div className="buttons-container">
					<Button buttonType='base' type="submit">Sign In</Button>
					<Button 
						type='button' 
						buttonType='google'
						onClick={signInWithGoogle}
						>Google Sign In</Button>				
				</div>
			</form>
		</div>
	)
}

export default SignInForm;