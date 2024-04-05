// Import core functions
import { Divider } from 'primereact/divider';

// Import CSS
import './LoginDesktop.css';
import './LoginGlobal.css';

// Import core UI components
// ---

// Import UI components
import LoginOptionsMenu from '../../components/Login/LoginOptionsMenu';
import LoginForm from '../../components/Login/LoginForm';
import StudentCreationForm from '../../components/Login/StudentCreateAccount';

// React function to render the login page for desktop devices
const LoginDesktop: React.FC = () => {
  return (
    <>
      <h1>Welcome!</h1>
      <p className='login-subheader'>
        Please login or create a new account.
      </p>
      <LoginOptionsMenu/>
      <Divider/>
      <LoginForm 
        accountType='[Type]'
      />
      <Divider/>
      <StudentCreationForm/>
    </>
  );
};

export default LoginDesktop;
