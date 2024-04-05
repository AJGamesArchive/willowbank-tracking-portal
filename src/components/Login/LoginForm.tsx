// Import core functions
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { confirmDialog } from 'primereact/confirmdialog';

// Import CSS
import './LoginForm.css';

// Interfacing forcing certain props on the login form
interface LoginFormProps {
  accountType: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  setOptionMenuVisible: (value: boolean) => void;
};

// React function to render the student login form
const LoginForm: React.FC<LoginFormProps> = ({accountType, visible, setVisible, setOptionMenuVisible}) => {
  // Variables to store the required login credentials
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Variables to control the loading state of the form buttons
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [loadingClear, setLoadingClear] = useState<boolean>(false);

  // Variables to control the form input field styling
  const [usernameStyle, setUsernameStyle] = useState<string>("");
  const [passwordStyle, setPasswordStyle] = useState<string>("");

  // Variable to control blocking certain sections of the UI
  const [blockForm, setBlockForm] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);
  const accept = () => {
    clearForm();
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Form cleared successfully.',
      closeIcon: 'pi pi-times',
      life: 5000,
    });
  };
  const reject = () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Operation Cancelled',
      detail: 'The form has not been cleared.',
      closeIcon: 'pi pi-times',
      life: 5000,
    });
  };

  // Variables to store confirmation dialogue messages
  const confirmFormClear = () => {
    confirmDialog({
      message: 'Are you sure you want to clear the form?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      position: 'top',
      accept,
      reject
    });
  };
  const confirmFormClose = () => {
    confirmDialog({
      message: "Are you sure you want to close the form? All the details you've added will be lost.",
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      position: 'top',
      accept: () => {
        setVisible(false);
        setOptionMenuVisible(true);
      },
      reject: () => {}
    });
  };

  // Async function to handel the form submission
  async function loginHandler() {
    setLoadingLogin(true);
    setBlockForm(true);
    setUsernameStyle("p-invalid");
    setPasswordStyle("p-invalid");
    setTimeout(() => {
      setLoadingLogin(false);
      setBlockForm(false);
      setUsernameStyle("");
      setPasswordStyle("");
    }, 2000);
    return;
  };

  // Function to clear the form
  function clearForm() {
    setLoadingClear(true);
    setUsername("");
    setPassword("");
    setLoadingClear(false);
    return;
  }

  // Return JSX
  return (
    <BlockUI blocked={blockForm}>
      <Card title={`${accountType} Login`} subTitle='Enter your credentials:' style={{ display: visible ? 'block' : 'none' }}>
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="login-username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
              className={usernameStyle}
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
                className={passwordStyle}
              />
              <label htmlFor="login-password">Password</label>
            </span>
          </div>
        </div>

        <Toast ref={toast} />

        <div className="student-login-form-button-field">
          <div className="student-login-form-button">
            <Button label="Login" icon="pi pi-check" loading={loadingLogin} onClick={loginHandler} raised severity="info"/>
          </div>
          <div className="student-login-form-button">
            <Button label="Clear" icon="pi pi-exclamation-triangle" loading={loadingClear} onClick={confirmFormClear} raised severity="warning"/>
          </div>
          <div className="student-login-form-button">
            <Button label="Back" icon="pi pi-arrow-left" onClick={() => {
              if (username !== "" || password !== "") {
                confirmFormClose();
              } else {
                setVisible(false);
                setOptionMenuVisible(true);
              };
            }} severity="secondary"/>
          </div>
        </div>
      </Card>
    </BlockUI>
  );
};

export default LoginForm;
