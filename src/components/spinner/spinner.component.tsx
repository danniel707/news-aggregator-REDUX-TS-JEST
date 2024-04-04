import { FC } from 'react';
import './spinner.styles.scss'; 

const Spinner: FC = () => (
  <div className="SpinnerOverlay" data-testid="spinner">
    <div className="SpinnerContainer" />
  </div>
);

export default Spinner;
