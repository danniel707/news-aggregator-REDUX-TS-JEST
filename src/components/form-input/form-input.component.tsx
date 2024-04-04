import { FC, TextareaHTMLAttributes, InputHTMLAttributes } from 'react';

import './form-input.styles.scss'

type Props = {
  label: string;
  type: 'textarea' | 'text' | 'password' | 'email';
} & ( | TextareaHTMLAttributes<HTMLTextAreaElement> | InputHTMLAttributes<HTMLInputElement>);

const FormInput: FC<Props> = ({ label, type, ...otherProps }) => {
  if (type === 'textarea') {
    return (
      <div className="form">
        <label className="form-labels">{label}</label>
        <textarea className="form-fields textarea" {...otherProps as TextareaHTMLAttributes<HTMLTextAreaElement>} />
      </div>
    );
  }

  return (
    <div className="form">
      <label className="form-labels">{label}</label>
      <input className="form-fields" type={type} {...otherProps as InputHTMLAttributes<HTMLInputElement>} />
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
