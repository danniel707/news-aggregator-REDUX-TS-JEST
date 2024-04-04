import { FC, ButtonHTMLAttributes } from 'react';
import './button.styles.scss';

export enum BUTTON_TYPE_CLASSES {
	base= 'base-button',	
	google = 'google-sign-in',
	openModal= 'create-post-open-modal',
	createPost= 'create-post',
	sendComment= 'send-comment',
	deletePost= 'delete-post',
	deleteComment= 'delete-comment',
	inverted= 'inverted'
}


type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonType: keyof typeof BUTTON_TYPE_CLASSES;
};

const Button: FC<Props> = ({ children, buttonType, ...otherProps }) => {

	return (
		<button 
			className={`base-button ${BUTTON_TYPE_CLASSES[buttonType]}`}
			{...otherProps}			
		>
			{children}
		</button>
	);
};

export default Button;