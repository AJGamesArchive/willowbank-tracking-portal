// Import core functions
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { confirmDialog } from 'primereact/confirmdialog';
import { Messages } from 'primereact/messages';

// Import CSS
import './StudentCreateAccount.css';

// Import functions
import { schoolSearcher } from '../../functions/Login/SchoolSearcher';
import { generateUsername } from '../../functions/Login/GenerateUsername';
import { generatePassword } from '../../functions/Login/GeneratePassword';

// Import types
import { SchoolSearch } from '../../types/Login/SchoolSearch';
import { UsernameGen } from '../../types/Login/UsernameGen';

// Interfacing forcing certain props on the Student Account Creation form
interface StudentAccountCreationProps {
  accountType: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  setOptionMenuVisible: (value: boolean) => void;
};

// React function to render the student login form
const StudentCreationForm: React.FC<StudentAccountCreationProps> = ({accountType, visible, setVisible, setOptionMenuVisible}) => {
  // Variables to store the required login credentials
  const [schoolCode, setSchoolCode] = useState<any>(null);
  const [schoolName, setSchoolName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [surnameInitial, setSurnameInitial] = useState<any>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

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
  const [confirmPasswordStyle, setConfirmPasswordStyle] = useState<string>("");

  // Variable to store password generated message
  const msg = useRef<Messages>(null);

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
      life: 7000,
    });
  };
  const reject = () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Operation Cancelled',
      detail: 'The form has not been cleared.',
      closeIcon: 'pi pi-times',
      life: 7000,
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
        clearHighlighting();
        clearForm();
        setOptionMenuVisible(true);
      },
      reject: () => {}
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
    setConfirmPasswordStyle("p-invalid");
    setTimeout(() => {
      setLoadingCreation(false);
      setBlockForm(false);
      clearHighlighting();
    }, 2000);
    return;
  };

  // Function to clear the form
  function clearForm(): void {
    setLoadingClear(true);
    setSchoolCode(null);
    setSchoolName("");
    setFirstName("");
    setSurnameInitial("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setLoadingClear(false);
    return;
  };

  // Async function to handle searching for a school based on a given school code
  async function schoolSearchHandler(): Promise<void> {
    setLoadingSchoolSearch(true);

    // Attempt to retrieve the name of the school that matches the given ID
    const results: SchoolSearch = await schoolSearcher(schoolCode);
    if (results.errored) {
      const errorDialogue = () => {
        toast.current?.show({
          severity: `error`,
          summary: `${results.errorMessage.header}`,
          detail: `${results.errorMessage.message}`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
      };
      errorDialogue();
      setSchoolCode(null);
      setSchoolCodeStyle("p-invalid");
      setLoadingSchoolSearch(false);
      return;
    };

    // Update the school name field on the creation form
    setSchoolName(results.schoolName);
    const confirmationDialogue = () => {
      toast.current?.show({
        severity: `success`,
        summary: `School Name Retrieved`,
        detail: `The given school code was valid and '${results.schoolName}' has been detected as your school.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    confirmationDialogue();
    setLoadingSchoolSearch(false);
    return;
  };

  // async function to handle username generation
  async function usernameGenerationHandler(): Promise<void> {
    setLoadingUsernameGen(true);

    // Ensure the user has provided their first name and surname initial
    if (firstName === "" || surnameInitial === null || surnameInitial === "") {
      const errorDialogue = () => {
        toast.current?.show({
          severity: `error`,
          summary: `Missing Details`,
          detail: `Please ensure you enter your first name and surname initial before trying to generate a username.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
      };
      errorDialogue();
      if (firstName === "") {
        setFirstNameStyle("p-invalid");
      };
      if (surnameInitial === null || surnameInitial === "") {
        setSurnameStyle("p-invalid");
      };
      setLoadingUsernameGen(false);
      return;
    };

    // Generate username and ensure it's unique
    const genUsername: UsernameGen = await generateUsername(firstName, surnameInitial);
    if (!genUsername.success) {
      const errorDialogue = () => {
        toast.current?.show({
          severity: `error`,
          summary: `Unexpected Error Occurred`,
          detail: `An unexpected error occurred while validating if the generated usernames is unique.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
      };
      errorDialogue();
      setLoadingUsernameGen(false);
      return;
    };

    // Save and output the generated username
    setUsername(genUsername.name);
    const confirmationDialogue = () => {
      toast.current?.show({
        severity: `success`,
        summary: `Username Generated`,
        detail: `The username '${genUsername.name}' was generated successfully.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    confirmationDialogue();

    setLoadingUsernameGen(false);
    return;
  };

  // Function to handle password generation
  function passwordGenerationHandler() {
    setLoadingPasswordGen(true);
    
    // Ensure the user has provided their first name and surname initial
    if (firstName === "" || surnameInitial === null || surnameInitial === "") {
      const errorDialogue = () => {
        toast.current?.show({
          severity: `error`,
          summary: `Missing Details`,
          detail: `Please ensure you enter your first name and surname initial before trying to generate a password.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
      };
      errorDialogue();
      if (firstName === "") {
        setFirstNameStyle("p-invalid");
      };
      if (surnameInitial === null || surnameInitial === "") {
        setSurnameStyle("p-invalid");
      };
      setLoadingPasswordGen(false);
      return;
    };

    // Generate a password and output it to the user
    const genPassword: string = generatePassword(firstName, surnameInitial);
    setPassword(genPassword);
    const confirmationDialogue = () => {
      toast.current?.show({
        severity: `success`,
        summary: `Password Generated`,
        detail: `The password '${genPassword}' was generated successfully.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    confirmationDialogue();
    const showPassword = () => {
      msg.current?.show([
        {
          severity: 'info',
          summary: 'Generated Password:',
          detail: `${genPassword}`,
          sticky: true,
          closable: true,
          closeIcon: 'pi pi-times'
        }
      ]);
    };
    showPassword();

    setLoadingPasswordGen(false);
    return;
  };

  // Function to clear all the error highlighting
  function clearHighlighting(): void {
    setSchoolCodeStyle("");
    setSchoolNameStyle("");
    setFirstNameStyle("");
    setSurnameStyle("");
    setUsernameStyle("");
    setPasswordStyle("");
    setConfirmPasswordStyle("");
    return;
  };

  // Return JSX
  return (
    <BlockUI blocked={blockForm}>
    <Toast ref={toast} />
    <Card title={`Create New ${accountType} Account`} subTitle='Enter your details:' style={{ display: visible ? 'block' : 'none' }}>
      <div className="p-inputgroup flex-1">
        <span className="p-float-label">
          <InputMask 
            id="school_code_input"
            value={schoolCode} 
            onChange={(e: InputMaskChangeEvent) => {
              setSchoolName("");
              setSchoolCode(e.target.value);
            }}
            mask="99-99-99"
            slotChar="00-00-00"
            className={schoolCodeStyle}
            aria-describedby='school-code-help'
          />
          <label htmlFor="school_code_input">School Code</label>
          <Button label='Search' icon="pi pi-search" loading={loadingSchoolSearch} onClick={() => {
            setSchoolCodeStyle("");
            schoolSearchHandler();
          }} severity="info"/>
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
            <Button label="Clear" icon="pi pi-times" onClick={() => {
              setSchoolName("");
              setSchoolNameStyle("");
              setSchoolCode(null);
              setSchoolCodeStyle("");
            }} severity="secondary"/>
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
            <Button label='Generate' icon="pi pi-sync" loading={loadingUsernameGen} onClick={() => {
              setUsernameStyle("");
              setFirstNameStyle("");
              setSurnameStyle("");
              usernameGenerationHandler();
            }} severity="info"/>
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
            <Button label='Generate' icon="pi pi-sync" loading={loadingPasswordGen} onClick={() => {
              setPasswordStyle("");
              setFirstNameStyle("");
              setSurnameStyle("");
              passwordGenerationHandler();
            }} severity="info"/>
          </span>
        </div>
        <small id="password-help" className='creation-form-help-text'>
          Create your own memorable password or have one generated.
        </small>
      </div>

      <Messages ref={msg}/>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
              className={confirmPasswordStyle}
              aria-describedby='confirm-password-help'
            />
            <label htmlFor="confirm-password">Confirm Password</label>
          </span>
        </div>
        <small id="confirm-password-help" className='creation-form-help-text'>
          Re-enter your password to confirm it's correct.
        </small>
      </div>

      <div className="student-creation-form-button-field">
        <div className="student-creation-form-button">
          <Button label="Login" icon="pi pi-check" loading={loadingCreation} onClick={() => {
            clearHighlighting();
            creationHandler();
          }} raised severity="info"/>
        </div>
        <div className="student-creation-form-button">
          <Button label="Clear" icon="pi pi-exclamation-triangle" loading={loadingClear} onClick={() => {
            clearHighlighting();
            confirmFormClear();
          }} raised severity="warning"/>
        </div>
        <div className="student-login-form-button">
          <Button label="Back" icon="pi pi-arrow-left" onClick={() => {
            if (schoolCode !== null || firstName !== "" || surnameInitial !== "" || username !== "" || password !== "" || confirmPassword !== "") {
              confirmFormClose();
            } else {
              setVisible(false);
              clearHighlighting();
              clearForm();
              setOptionMenuVisible(true);
            }
          }} severity="secondary"/>
        </div>
      </div>
    </Card>
    </BlockUI>
  );
};

export default StudentCreationForm;
