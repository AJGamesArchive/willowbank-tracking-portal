// Import core functions
import { useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';

// Import CSS
import './LoginDesktop.css';
import './LoginGlobal.css';

// Import UI components
import LoginOptionsMenu from '../../components/Login/LoginOptionsMenu';
import LoginForm from '../../components/Login/LoginForm';
import ForgotPassword from '../../components/Login/ForgotPassword';
import StudentCreationForm from '../../components/Login/StudentCreateAccount';

// React function to render the login page for desktop devices
const LoginDesktop: React.FC = () => {
  // Variables to control the visibility of page components
  const [visibleOptionsMenu, setVisibleOptionsMenu] = useState<boolean>(true);
  const [visibleLoginForm, setVisibleLoginForm] = useState<boolean>(false);
  const [visibleForgotPasswordForm, setVisibleForgotPasswordForm] = useState<boolean>(false);
  const [visibleCreationForm, setVisibleCreationForm] = useState<boolean>(false);
  
  // Variable to store the account type being logged into
  const [accountType, setAccountType] = useState<string>("[ERROR]");

  // Return JSX
  return (
    <>
      <ConfirmDialog/>
      <LoginOptionsMenu
        setLoginType={setAccountType}
        visible={visibleOptionsMenu}
        setVisible={setVisibleOptionsMenu}
        setLoginFormView={setVisibleLoginForm}
        setCreationFormView={setVisibleCreationForm}
      />
      <LoginForm 
        accountType={accountType}
        visible={visibleLoginForm}
        setVisible={setVisibleLoginForm}
        setOptionMenuVisible={setVisibleOptionsMenu}
        setForgotPasswordVisible={setVisibleForgotPasswordForm}
      />
      <ForgotPassword
        accountType={accountType}
        visible={visibleForgotPasswordForm}
        setVisible={setVisibleForgotPasswordForm}
        setLoginFormVisibility={setVisibleLoginForm}
      />
      <StudentCreationForm
        accountType={accountType}
        visible={visibleCreationForm}
        setVisible={setVisibleCreationForm}
        setOptionMenuVisible={setVisibleOptionsMenu}
        userPOV='student'
      />
    </>
  );
};

export default LoginDesktop;
