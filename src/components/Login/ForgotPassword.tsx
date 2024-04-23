// Import core functions
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { Avatar } from 'primereact/avatar';

// Import CSS
import './ForgotPassword.css'

// Importing functions
import { createPasswordRequest } from '../../functions/Login/PasswordResetRequest';
import { isUniqueUsernameName } from '../../functions/Validation/IsUniqueUsername';

// Interfacing forcing certain props on the forgot password form
interface ForgotPasswordFormProps {
  accountType: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  setLoginFormVisibility: (value: boolean) => void;
};

// React function to render the Forgot Password form
const ForgotPassword: React.FC<ForgotPasswordFormProps> = ({ accountType, visible, setVisible, setLoginFormVisibility }) => {
  // Variables to store required form credentials
  const [username, setUsername] = useState<string>("");

  // Variables to control the form input field styling
  const [usernameStyle, setUsernameStyle] = useState<string>("");

  // Variables to control the loading state of the form buttons
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  // Variable to control blocking certain sections of the UI
  const [blockForm, setBlockForm] = useState<boolean>(false);

  // Variable(s) to handle 'More Info' visibility and toggle button styling accordingly'
  const [visibleMoreInfo, setVisibleMoreInfo] = useState<boolean>(false);
  const [moreInfoButton, setMoreInfoButton] = useState<string>("More Info");
  const [moreInfoButtonColor, setMoreInfoButtonColor] = useState<any>("help");
  const [moreInfoButtonIcon, setMoreInfoButtonIcon] = useState<string>("pi pi-question-circle");

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Declaring general unexpected error message
  const unexpectedError = () => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred. Please try again.',
      closeIcon: 'pi pi-times',
      life: 7000,
    });
  };

  // Async function to handel the password reset request submissions
  async function passwordResetRequestHandler(): Promise<void> {
    // UI Locking mechanisms
    setUsernameStyle("");
    setBlockForm(true);
    setLoadingSubmit(true);
    const unlock = () => {
      setBlockForm(false);
      setLoadingSubmit(false);
    };

    // Detect what account type is trying to request a password reset
    let db_collection: string;
    switch(accountType) {
      case ("Admin"):
        db_collection = "admins";
        break;
      case ("Teacher"):
        db_collection = "teachers";
        break;
      default:
        db_collection = "students";
        break;
    };

    // Ensure that a valid username has been entered
    if(username === "") {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Username',
        detail: 'You have not entered a username. Please enter a username and try again.',
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setUsernameStyle("p-invalid");
      unlock(); return;
    };
    const isUnique: boolean | string = await isUniqueUsernameName(username);
    if(typeof isUnique === "string") {
      unexpectedError();
      unlock(); return;
    };
    if(isUnique) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Invalid Username',
        detail: 'The username you entered does not exist. Please check that your username is correct.',
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      unlock(); return;
    };

    // Create the password reset request
    const successfulCreation: boolean = await createPasswordRequest(username, db_collection);
    if(!successfulCreation) {
      unexpectedError();
      unlock(); return;
    };

    // Confirm request creation
    toast.current?.show({
      severity: 'success',
      summary: 'Request Sent',
      detail: `A password reset request has been created for '${username}' successfully. Please do not send another request unless a member of staff asks you to.`,
      closeIcon: 'pi pi-times',
      life: 7000,
    });

    setUsername("");
    unlock(); return;
  };

  // Declaring 'More Info' section messages
  const infoA: string = "To reset your password, you must use this form to send a request to an Admin by submitting your username. You will then have to wait for an Admin to reset your password and inform you of what your new password is.";
  const infoB: string = "Please only send 1 request unless a member of Staff asks you to send another request.";

  // Returning JSX
  return (
    <BlockUI blocked={blockForm}>
      <Toast ref={toast}/>
      <Card title={`Password Reset Request`} subTitle='Please enter your username:' style={{ display: visible ? 'block' : 'none' }}>
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="pass-reset-username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
              className={usernameStyle}
            />
            <label htmlFor="pass-reset-username">Username</label>
          </span>
        </div>

        <div className="pass-reset-form-button-field">
          <div className="pass-reset-form-button">
            <Button label="Submit" icon="pi pi-check" loading={loadingSubmit} onClick={passwordResetRequestHandler} raised severity="info"/>
          </div>
          <div className="pass-reset-form-button">
            {
              /*
                TODO Maybe swap this field out for the Toggle Button component?
              */
            }
            <Button label={moreInfoButton} icon={moreInfoButtonIcon} loading={false} onClick={() => {
              setVisibleMoreInfo((visibleMoreInfo) ? false : true);
              setMoreInfoButton((visibleMoreInfo) ? "More Info" : "Hide Info");
              setMoreInfoButtonColor((visibleMoreInfo) ? "help" : "secondary");
              setMoreInfoButtonIcon((visibleMoreInfo) ? "pi pi-question-circle" : "pi pi-angle-up");
            }} raised severity={moreInfoButtonColor}/>
          </div>
          <div className="pass-reset-form-button">
            <Button label="Back" icon="pi pi-arrow-left" onClick={() => {
              setUsername("");
              setVisible(false);
              setVisibleMoreInfo(false);
              setMoreInfoButton("More Info");
              setMoreInfoButtonColor("help");
              setMoreInfoButtonIcon("pi pi-question-circle");
              setLoginFormVisibility(true);
            }} raised severity="secondary"/>
          </div>
        </div>
        
        <div style={{ display: visibleMoreInfo ? 'block' : 'none' }}>
          <div className="more-info-segment">
            <Avatar icon="pi pi-question-circle" shape="circle" style={{ backgroundColor: '#cca9f1', color: '#000000' }} />
            <span className="more-info-segment-header">Password Reset Request Info</span>
          </div>
        </div>

        <div style={{ display: visibleMoreInfo ? 'block' : 'none' }}>
          <div className="more-info-segment">
            <span>{infoA}</span>
          </div>
          <div className="more-info-segment">
            <span>{infoB}</span>
          </div>
        </div>
      </Card>
    </BlockUI>
  );
};

export default ForgotPassword;
