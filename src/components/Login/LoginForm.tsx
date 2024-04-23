// Import core functions
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { BlockUI } from 'primereact/blockui';
import { Messages } from 'primereact/messages';
import { Divider } from 'primereact/divider';

// Import CSS
import './LoginForm.css';

// Import types
import { AccountLogin } from '../../types/Login/AccountLogin';

// Import functions
import { login } from '../../functions/Login/Login';

// Interfacing forcing certain props on the login form
interface LoginFormProps {
  accountType: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  setOptionMenuVisible: (value: boolean) => void;
  setForgotPasswordVisible: (value: boolean) => void;
};

// React function to render the student login form
const LoginForm: React.FC<LoginFormProps> = ({accountType, visible, setVisible, setOptionMenuVisible, setForgotPasswordVisible}) => {
  // Variables to store the required login credentials
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Variables to control the loading state of the form buttons
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);

  // Variables to control the form input field styling
  const [usernameStyle, setUsernameStyle] = useState<string>("");
  const [passwordStyle, setPasswordStyle] = useState<string>("");

  // Variable to store section specific error messages
  const msgUsername = useRef<Messages>(null);
  const msgPassword = useRef<Messages>(null);

  // Variable to control blocking certain sections of the UI
  const [blockForm, setBlockForm] = useState<boolean>(false);

  // Async function to handel the form submission
  async function loginHandler(): Promise<void> {
    setLoadingLogin(true);
    setBlockForm(true);
    const unlock = () => {
      setLoadingLogin(false);
      setBlockForm(false);
    };

    // Ensure a username has been entered
    if (username === "") {
      msgUsername.current?.show([
        {
          severity: 'warn',
          summary: 'Invalid Username',
          detail: ``,
          sticky: true,
          closable: true,
          closeIcon: 'pi pi-times'
        }
      ]);
      setUsernameStyle("p-invalid");
      unlock(); return;
    };

    // Ensure a password has been entered
    if (password === "") {
      msgPassword.current?.show([
        {
          severity: 'warn',
          summary: 'Invalid Password',
          detail: ``,
          sticky: true,
          closable: true,
          closeIcon: 'pi pi-times'
        }
      ]);
      setPasswordStyle("p-invalid");
      unlock(); return;
    };

    // Login Handler - Ensure username and password match
    const loginState: AccountLogin = await login(accountType, username, password);
    if (!loginState.successful) {
      msgPassword.current?.show([
        {
          severity: 'error',
          summary: 'Invalid Credentials',
          detail: ``,
          sticky: true,
          closable: true,
          closeIcon: 'pi pi-times'
        }
      ]);
      setUsernameStyle("p-invalid");
      setPasswordStyle("p-invalid");
      unlock(); return;
    };

    // Successful login - Send user to their respective portal
    unlock();
    clearForm();

    // Send the user to their respective portal
    switch(accountType) {
      case ("Admin"): // Send to admin portal
        window.location.href = `/adminportal/${loginState.snowflake}/${loginState.token}/${loginState.name}`;
        break;
      case ("Teacher"): // Send to teacher portal
        window.location.href = `/teacherportal/${loginState.snowflake}/${loginState.token}/${loginState.name}`;
        break;
      default: // Send to student portal
        window.location.href = `/studenthome/${loginState.snowflake}/${loginState.token}/${loginState.name}`;
        break;
    };

    return;
  };

  // Function to clear the form
  function clearForm(): void {
    setUsername("");
    setPassword("");
    return;
  };

  // Function to clear all the error highlighting
  function clearHighlighting(): void {
    msgUsername.current?.clear();
    msgPassword.current?.clear();
    setUsernameStyle("");
    setPasswordStyle("");
    return;
  };

  // Return JSX
  return (
    <BlockUI blocked={blockForm}>
      {
        /*
          ! --------------------------------------------
          ! Here for development purposes - remove later
        */
      }
      <div style={{ display: visible ? 'block' : 'none' }}>
        <Button label={`[DEV] ${accountType} Details`} icon="pi pi-exclamation-triangle" onClick={() => {
          switch (accountType) {
            case ("Teacher"):
              console.log("Username: Test Teacher\nPassword: teacher1");
              setUsername("Test Teacher");
              setPassword("teacher1");
              break;
            case ("Admin"):
              console.log("Username: Test Admin\nPassword: Admin");
              setUsername("Test Admin");
              setPassword("Admin");
              break;
            default:
              console.log("Username: Test School\nPassword: School");
              setUsername("Test School");
              setPassword("School");
              break;
          };
        }} raised severity="help"/>
        <Divider/>
      </div>
      {
        /*
          ! Here for development purposes - remove later
          ! --------------------------------------------
        */
      }
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

        <Messages ref={msgUsername}/>

        <div className="student-login-form-field">
          <div className="p-inputgroup flex-1">
            <span className="p-float-label">
              {
                /*
                  TODO Maybe swap this field out for the Password component, allowing you to add a feedback toggle
                */
              }
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

        <Messages ref={msgPassword}/>

        <div className="student-login-form-button-field">
          <div className="student-login-form-button">
            <Button label="Login" icon="pi pi-sign-in" loading={loadingLogin} onClick={() => {
              clearHighlighting();
              loginHandler();
            }} raised severity="info"/>
          </div>
          <div className="student-login-form-button">
            <Button label="Forgot Password" icon="pi pi-question-circle" onClick={() => {
              setVisible(false);
              setForgotPasswordVisible(true);
            }} raised severity="help"/>
          </div>
          <div className="student-login-form-button">
            <Button label="Back" icon="pi pi-arrow-left" onClick={() => {
              setVisible(false);
              setOptionMenuVisible(true);
              clearHighlighting();
              clearForm();
            }} raised severity="secondary"/>
          </div>
        </div>
      </Card>
    </BlockUI>
  );
};

export default LoginForm;
