import { FC, TextareaHTMLAttributes, InputHTMLAttributes } from 'react';

import './form-input.styles.scss'

type Props = {
  label: string;
  type: 'textarea' | 'text' | 'password' | 'email';
  id: string;
} & ( | TextareaHTMLAttributes<HTMLTextAreaElement> | InputHTMLAttributes<HTMLInputElement>);

const FormInput: FC<Props> = ({ label, type, id, ...otherProps }) => {
  if (type === 'textarea') {
    return (
      <div className="form">
        <label className="form-labels" htmlFor={id}>{label}</label>
        <textarea className="form-fields textarea" id={id} {...otherProps as TextareaHTMLAttributes<HTMLTextAreaElement>} />
      </div>
    );
  }

  return (
    <div className="form">
      <label className="form-labels" htmlFor={id}>{label}</label>
      <input className="form-fields" type={type} id={id} {...otherProps as InputHTMLAttributes<HTMLInputElement>} />
    </div>
  );
};

export default FormInput;

//...otherProps
// <input 
// 	type='text' 
// 	required 
// 	onChange={changeHandler} 
// 	name="displayName" 
// 	value={displayName}
// />
