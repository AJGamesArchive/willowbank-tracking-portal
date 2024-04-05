// Import core functions
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { confirmDialog } from 'primereact/confirmdialog';

// Import CSS
import './StudentCreateAccount.css';

// Interfacing forcing certain props on the Student Account Creation form
interface StudentAccountCreationProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setOptionMenuVisible: (value: boolean) => void;
};

// React function to render the student login form
const StudentCreationForm: React.FC<StudentAccountCreationProps> = ({visible, setVisible, setOptionMenuVisible}) => {
  // Variables to store the required login credentials
  const [schoolCode, setSchoolCode] = useState<any>();
  const [schoolName, setSchoolName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [surnameInitial, setSurnameInitial] = useState<any>();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Variables to control the loading state of the form buttons
  const [loadingCreation, setLoadingCreation] = useState<boolean>(false);
  const [loadingClear, setLoadingClear] = useState<boolean>(false);
  const [loadingSchoolSearch, setLoadingSchoolSearch] = useState<boolean>(false);
  const [loadingUsernameGen, setLoadingUsernameGen] = useState<boolean>(false);
  const [loadingPasswordGen, setLoadingPasswordGen] = useState<boolean>(false);

  // Variables to control the form input field styling
  const [schoolCodeStyle, setSchoolCodeStyle] = useState<string>("");
  const [schoolNameStyle, setSchoolNameStyle] = useState<string>("");
  const [firstNameStyle, setFirstNameStyle] = useState<string>("");
  const [surnameStyle, setSurnameStyle] = useState<string>("");
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

  // Async function to handel the form submission
  async function creationHandler() {
    setLoadingCreation(true);
    setBlockForm(true);
    setSchoolCodeStyle("p-invalid");
    setSchoolNameStyle("p-invalid");
    setFirstNameStyle("p-invalid");
    setSurnameStyle("p-invalid");
    setUsernameStyle("p-invalid");
    setPasswordStyle("p-invalid");
    setTimeout(() => {
      setLoadingCreation(false);
      setBlockForm(false);
      setSchoolCodeStyle("");
      setSchoolNameStyle("");
      setFirstNameStyle("");
      setSurnameStyle("");
      setUsernameStyle("");
      setPasswordStyle("");
    }, 2000);
    return;
  };

  // Function to clear the form
  function clearForm() {
    setLoadingClear(true);
    setSchoolCode(null);
    setSchoolName("");
    setFirstName("");
    setSurnameInitial("");
    setUsername("");
    setPassword("");
    setLoadingClear(false);
    return;
  }

  // Async function to handle searching for a school based on a given school code
  async function schoolSearchHandler() {
    setLoadingSchoolSearch(true);
    setTimeout(() => {
      setLoadingSchoolSearch(false);
    }, 2000);
    return;
  }

  // Function to handle username generation
  function usernameGenerationHandler() {
    setLoadingUsernameGen(true);
    setTimeout(() => {
      setLoadingUsernameGen(false);
    }, 2000);
    return;
  }

  // Function to handle password generation
  function passwordGenerationHandler() {
    setLoadingPasswordGen(true);
    setTimeout(() => {
      setLoadingPasswordGen(false);
    }, 2000);
    return;
  }

  // Return JSX
  return (
    <BlockUI blocked={blockForm}>
    <Card title='Create New Account' subTitle='Enter your details:' style={{ display: visible ? 'block' : 'none' }}>
      <div className="p-inputgroup flex-1">
        <span className="p-float-label">
          <InputMask 
            id="school_code_input"
            value={schoolCode} 
            onChange={(e: InputMaskChangeEvent) => setSchoolCode(e.target.value)}
            mask="99-99-99"
            slotChar="00-00-00"
            className={schoolCodeStyle}
            aria-describedby='school-code-help'
          />
          <label htmlFor="school_code_input">School Code</label>
          <Button label='Search' icon="pi pi-search" loading={loadingSchoolSearch} onClick={schoolSearchHandler} severity="info"/>
        </span>
      </div>
      <small id="school-code-help" className='creation-form-help-text'>
        Enter the 6-digit code that your school or instructor has provided.
      </small>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="school-name"
              value={schoolName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolName(e.target.value)}
              required
              disabled
              className={schoolNameStyle}
              aria-describedby='school-name-help'
            />
            <label htmlFor="school-name">School Name</label>
            <Button label="Clear" icon="pi pi-times" onClick={() => {setSchoolName("")}} severity="secondary"/>
          </span>
        </div>
        <small id="school-name-help" className='creation-form-help-text'>
          Your schools name will be filled in automatically.
        </small>
      </div>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="first-name"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value.toUpperCase())}
              required
              className={firstNameStyle}
              aria-describedby='first-name-help'
            />
            <label htmlFor="first-name">First Name</label>
          </span>
        </div>
        <small id="first-name-help" className='creation-form-help-text'>
          Enter just your first name.
        </small>
      </div>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputMask 
              id="surname-initial"
              value={surnameInitial}
              onChange={(e: InputMaskChangeEvent) => setSurnameInitial(e.target.value?.toUpperCase())}
              mask="a"
              className={surnameStyle}
              aria-describedby='surname-help'
            />
            <label htmlFor="surname-initial">Surname Initial</label>
          </span>
        </div>
        <small id="surname-help" className='creation-form-help-text'>
          Enter just the first letter of your surname.
        </small>
      </div>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="creation-username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
              className={usernameStyle}
              aria-describedby='username-help'
            />
            <label htmlFor="creation-username">Username</label>
            <Button label='Generate' icon="pi pi-sync" loading={loadingUsernameGen} onClick={usernameGenerationHandler} severity="info"/>
          </span>
        </div>
        <small id="username-help" className='creation-form-help-text'>
          Create your own username or have one generated based on your name.
        </small>
      </div>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="creation-password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              className={passwordStyle}
              aria-describedby='password-help'
            />
            <label htmlFor="creation-password">Password</label>
            <Button label='Generate' icon="pi pi-sync" loading={loadingPasswordGen} onClick={passwordGenerationHandler} severity="info"/>
          </span>
        </div>
        <small id="password-help" className='creation-form-help-text'>
          Create your own memorable password or have one generated.
        </small>
      </div>

      <Toast ref={toast} />

      <div className="student-creation-form-button-field">
        <div className="student-creation-form-button">
          <Button label="Login" icon="pi pi-check" loading={loadingCreation} onClick={creationHandler} raised severity="info"/>
        </div>
        <div className="student-creation-form-button">
          <Button label="Clear" icon="pi pi-exclamation-triangle" loading={loadingClear} onClick={confirmFormClear} raised severity="warning"/>
        </div>
        <div className="student-login-form-button">
          <Button label="Back" icon="pi pi-arrow-left" onClick={() => {
            setVisible(false);
            setOptionMenuVisible(true);
          }} severity="secondary"/>
        </div>
      </div>
    </Card>
    </BlockUI>
  );
};

export default StudentCreationForm;
