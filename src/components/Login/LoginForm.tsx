// Import core functions
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';

// Import CSS
import './LoginForm.css';

// Interfacing forcing certain props on the login form
interface LoginFormProps {
  accountType: string;
}

// React function to render the student login form
const LoginForm: React.FC<LoginFormProps> = ({accountType}) => {
  // Variables to store the required login credentials
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Variables to control the loading state of the form buttons
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [loadingClear, setLoadingClear] = useState<boolean>(false);

  // Variable to control blocking certain sections of the UI
  const [blockForm, setBlockForm] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);
  const formCleared = () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Info',
      detail: 'Form cleared successfully.',
      closeIcon: 'pi pi-times',
      life: 5000,
    });
  };

  // Async function to handel the form submission
  async function loginHandler() {
    setLoadingLogin(true);
    setBlockForm(true);
    setTimeout(() => {
      setLoadingLogin(false);
      setBlockForm(false);
    }, 2000);
    return;
  };

  // Function to clear the form
  function clearForm() {
    setLoadingClear(true);
    setUsername("");
    setPassword("");
    setLoadingClear(false);
    formCleared();
    return;
  }

  // Return JSX
  return (
    <BlockUI blocked={blockForm}>
      <Card title={`${accountType} Login`} subTitle='Enter your credentials:'>
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="login-username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="login-username">Username</label>
          </span>
        </div>

        <div className="student-login-form-field">
          <div className="p-inputgroup flex-1">
            <span className="p-float-label">
              <InputText
                id="login-password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="login-password">Password</label>
            </span>
          </div>
        </div>

        <div className="student-login-form-button-field">
          <div className="student-login-form-button">
            <Toast ref={toast} />
            <Button label="Login" icon="pi pi-check" loading={loadingLogin} onClick={loginHandler} raised severity="info"/>
          </div>
          <div className="student-login-form-button">
            <Toast ref={toast}/>
            <Button label="Clear" icon="pi pi-exclamation-triangle" loading={loadingClear} onClick={clearForm} raised severity="warning"/>
          </div>
        </div>
      </Card>
    </BlockUI>
  );
};

export default LoginForm;
