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
import { Password } from 'primereact/password';

// Import CSS
import './StudentCreateAccount.css';

// Importing <Password> UI Props
import { passwordStrengthMsgs, passwordSuggestionsHeader, passwordSuggestionsFooter } from '../../data/PasswordSuggestions';

// Import global params
import { GlobalParams } from '../../interfaces/GlobalParams';
import { useParams } from 'react-router-dom';

// Import functions
import { createStudentAccount } from '../../functions/Login/CreateStudentAccount';
import { schoolSearcher } from '../../functions/Login/SchoolSearcher';
import { generateUsername } from '../../functions/Login/GenerateUsername';
import { generatePassword } from '../../functions/Login/GeneratePassword';
import { isUniqueUsernameName } from '../../functions/Validation/IsUniqueUsername';

// Import types
import { SchoolSearch } from '../../types/Login/SchoolSearch';
import { UsernameGen } from '../../types/Login/UsernameGen';

// Interfacing forcing certain props on the Student Account Creation form
interface StudentAccountCreationProps {
  accountType: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  setOptionMenuVisible: (value: boolean) => void;
  userPOV: 'student' | 'admin';
};

// React function to render the student login form
const StudentCreationForm: React.FC<StudentAccountCreationProps> = ({accountType, visible, setVisible, setOptionMenuVisible, userPOV}) => {
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

  const [personPossession] = useState<string>(userPOV === 'student' ? 'your' : `the student's`)
  const [personPOV] = useState<string>(userPOV === 'student' ? 'you' : 'the student')

  // Variable to store password generated messag`
  const msg = useRef<Messages>(null);

  const params = useParams<GlobalParams>();

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
      position: 'center',
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
      position: 'center',
      accept: () => {
        setVisible(false);
        clearHighlighting();
        clearForm();
        setOptionMenuVisible(true);
        if(userPOV === "admin") window.location.href = `/adminportal/createaccountmenu/${params.snowflake}/${params.token}/${params.name}`
      },
      reject: () => {}
    });
  };

  // Async function to handel the form submission
  async function creationHandler() {
    setLoadingCreation(true);
    setBlockForm(true);
    const unlock = () => {
      setLoadingCreation(false);
      setBlockForm(false);
    };
    
    // Declaring base error for overall credential validation
    const detailValidationError = (type: any, title: string, message: string) => {
      toast.current?.show({
        severity: type,
        summary: `${title}`,
        detail: `${message}`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };

    // Ensure the entered school code is valid
    const results: SchoolSearch = await schoolSearcher(schoolCode);
    if (results.errored) {
      detailValidationError("error", "Unexpected Error Occurred", "The school code you entered is invalid. Please check your code is correct and try again.");
      setSchoolCode(null);
      setSchoolCodeStyle("p-invalid");
      unlock(); return;
    };

    // Ensure a valid school has been detected and assigned
    if (schoolName === "") {
      detailValidationError("warn", "No School Detected", `Ensure you detect your school by searching with a school code before creating ${personPossession} account.`);
      setSchoolNameStyle("p-invalid");
      unlock(); return;
    };

    // Ensure a first name has been provided
    if (firstName === "") {
      detailValidationError("warn", "Invalid First Name", "You have not entered a first name. Please provide a first name and try again.");
      setFirstNameStyle("p-invalid");
      unlock(); return;
    };

    // Ensure a surname initial has been provided
    if (surnameInitial === "" || surnameInitial === null) {
      detailValidationError("warn", "Invalid Surname Initial", "You have not entered a surname initial. Please enter a surname initial and try again.");
      setSurnameStyle("p-invalid");
      unlock(); return;
    };

    // Ensure a unique username has been entered
    if (username === "") {
      detailValidationError("warn", "Invalid Username", "You have not entered a username. Please enter a username and try again.");
      setUsernameStyle("p-invalid");
      unlock(); return;
    };
    const isUnique: boolean | string = await isUniqueUsernameName(username);
    if (typeof isUnique === "string") {
      detailValidationError("error", "An Unexpected Error Occurred", "An unexpected error occurred while validating the username uniques. Please try again.");
      setUsernameStyle("p-invalid");
      unlock(); return;
    };
    if(!isUnique) {
      detailValidationError("warn", "Invalid Username", "The username you have entered is not unique. Please enter a different username and try again.");
      setUsernameStyle("p-invalid");
      unlock(); return;
    };

    // Ensure that a password has been provided and ensure it matches the confirmation password
    if (password === "" || confirmPassword === "") {
      detailValidationError("warn", "Invalid Password", "You have not entered and/or confirmed a password. Please enter and confirm your password and try again.");
      (password === "") ? setPasswordStyle("p-invalid") : setConfirmPasswordStyle("p-invalid");
      unlock(); return;
    };
    if (password !== confirmPassword) {
      detailValidationError("warn", "Invalid Password", "You did not enter the same password twice. Please ensure you enter the same password twice.");
      setPasswordStyle("p-invalid");
      setConfirmPasswordStyle("p-invalid");
      unlock(); return;
    };

    // Create the student account
    const creationResults: boolean = await createStudentAccount(schoolCode, schoolName, firstName, surnameInitial, username, password);
    if (!creationResults) {
      detailValidationError("error", "Something Went Wrong", "An unexpected error occurred and the account was not able to be created. Please try again.");
      unlock(); return;
    };

    // Output confirmation message
    const accountCreatedConfirm = () => {
      toast.current?.show({
        severity: `success`,
        summary: `Account Creation Successful`,
        detail: `The account '${username}' was created successfully. '${personPOV}' should now be able to login from the student login page.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    accountCreatedConfirm();
    clearForm();
    unlock(); return;
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
      setLoadingSchoolSearch(false); return;
    };

    // Update the school name field on the creation form
    setSchoolName(results.schoolName);
    const confirmationDialogue = () => {
      toast.current?.show({
        severity: `success`,
        summary: `School Name Retrieved`,
        detail: `The given school code was valid and '${results.schoolName}' has been detected as ${personPossession} school.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    confirmationDialogue();
    setLoadingSchoolSearch(false); return;
  };

  // async function to handle username generation
  async function usernameGenerationHandler(): Promise<void> {
    setLoadingUsernameGen(true);

    // Ensure the user has provided their first name and surname initial
    if (firstName === "" || surnameInitial === null || surnameInitial === "") {
      const errorDialogue = () => {
        toast.current?.show({
          severity: `warn`,
          summary: `Missing Details`,
          detail: `Please ensure you enter ${personPossession} first name and surname initial before trying to generate a username.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
      };
      errorDialogue();
      (firstName === "") ? setFirstNameStyle("p-invalid") : setSurnameStyle("p-invalid");
      setLoadingUsernameGen(false); return;
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
      setLoadingUsernameGen(false); return;
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

    setLoadingUsernameGen(false); return;
  };

  // Function to handle password generation
  function passwordGenerationHandler() {
    setLoadingPasswordGen(true);
    
    // Ensure the user has provided their first name and surname initial
    if (firstName === "" || surnameInitial === null || surnameInitial === "") {
      const errorDialogue = () => {
        toast.current?.show({
          severity: `warn`,
          summary: `Missing Details`,
          detail: `Please ensure you enter ${personPossession} first name and surname initial before trying to generate a password.`,
          closeIcon: 'pi pi-times',
          life: 7000,
        });
      };
      errorDialogue();
      (firstName === "") ? setFirstNameStyle("p-invalid") : setSurnameStyle("p-invalid");
      setLoadingPasswordGen(false); return;
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
      msg.current?.clear();
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

    setLoadingPasswordGen(false); return;
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
    <Card title={`Create New ${accountType} Account`} subTitle={`Enter ${personPossession} details:`} style={{ display: visible ? 'block' : 'none' }}>
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
          }} raised/>
        </span>
      </div>
      <small id="school-code-help" className='creation-form-help-text'>
        Enter the 6-digit code that {personPossession} school or instructor has provided.
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
            }} raised severity="secondary"/>
          </span>
        </div>
        <small id="school-name-help" className='creation-form-help-text'>
          {personPossession[0].toUpperCase()}{personPossession.substring(1)} schools name will be filled in automatically.
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
              keyfilter="alpha"
            />
            <label htmlFor="first-name">First Name</label>
          </span>
        </div>
        <small id="first-name-help" className='creation-form-help-text'>
          Enter just {personPossession} first name.
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
              keyfilter="alpha"
            />
            <label htmlFor="surname-initial">Surname Initial</label>
          </span>
        </div>
        <small id="surname-help" className='creation-form-help-text'>
          Enter just the first letter of {personPossession} surname.
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
            }} raised/>
          </span>
        </div>
        <small id="username-help" className='creation-form-help-text'>
          Create {personPossession} username or have one generated based on {personPossession} name.
        </small>
      </div>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <Password
              id="creation-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              toggleMask
              header={passwordSuggestionsHeader}
              footer={passwordSuggestionsFooter}
              promptLabel={passwordStrengthMsgs.prompt}
              weakLabel={passwordStrengthMsgs.weak}
              mediumLabel={passwordStrengthMsgs.medium}
              strongLabel={passwordStrengthMsgs.strong}
              className={passwordStyle}
              aria-describedby='password-help'
            />
            <label htmlFor="creation-password">Password</label>
            <Button label='Generate' icon="pi pi-sync" loading={loadingPasswordGen} onClick={() => {
              setPasswordStyle("");
              setFirstNameStyle("");
              setSurnameStyle("");
              passwordGenerationHandler();
            }} raised/>
          </span>
        </div>
        <small id="password-help" className='creation-form-help-text'>
          Create {personPossession} password or have one generated.
        </small>
      </div>

      <Messages ref={msg}/>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <Password
              id="confirm-password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
              toggleMask
              feedback={false}
              className={confirmPasswordStyle}
              aria-describedby='confirm-password-help'
            />
            <label htmlFor="confirm-password">Confirm Password</label>
          </span>
        </div>
        <small id="confirm-password-help" className='creation-form-help-text'>
          Re-enter {personPossession} password to confirm it's correct.
        </small>
      </div>

      <div className="student-creation-form-button-field">
        <div className="student-creation-form-button">
          <Button label="Create" icon="pi pi-check" loading={loadingCreation} onClick={() => {
            clearHighlighting();
            creationHandler();
          }} raised/>
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
            };
          }} raised severity="secondary"/>
        </div>
      </div>
    </Card>
    </BlockUI>
  );
};

export default StudentCreationForm;
