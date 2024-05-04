// Import core functions
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { confirmDialog } from 'primereact/confirmdialog';
import { Messages } from 'primereact/messages';
import { Password } from 'primereact/password';

// Import CSS
import './StaffCreateAccount.css';

// Importing <Password> UI Props
import { passwordStrengthMsgs, passwordSuggestionsHeader, passwordSuggestionsFooter } from '../../data/PasswordSuggestions';

// Import functions 
import { createStaffAccount } from '../../functions/Login/CreateStaffAccount';
import { schoolSearcher } from '../../functions/Login/SchoolSearcher';
import { generateUsername } from '../../functions/Login/GenerateUsername';
import { generatePassword } from '../../functions/Login/GeneratePassword';
import { isUniqueUsernameName } from '../../functions/Validation/IsUniqueUsername';

// Import types
import { SchoolSearch } from '../../types/Login/SchoolSearch';
import { UsernameGen } from '../../types/Login/UsernameGen';
import { Chips } from 'primereact/chips';
import { ListBox } from 'primereact/listbox';
import { getSchoolName } from '../../functions/Student/GetSchoolName';

// Interfacing forcing certain props on the Student Account Creation form
interface StaffAccountCreationProps {
  accountType: string;
};

// React function to render the student login form
const StaffCreationForm: React.FC<StaffAccountCreationProps> = ({accountType}) => {
  // Variables to store the required login credentials
  const [schoolCodes, setSchoolCodes] = useState<string[]>([]);
  const [schoolNames, setSchoolNames] = useState<string[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<any>(null);
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
  
  const [firstNameStyle, setFirstNameStyle] = useState<string>("");
  const [surnameStyle, setSurnameStyle] = useState<string>("");
  const [usernameStyle, setUsernameStyle] = useState<string>("");
  const [passwordStyle, setPasswordStyle] = useState<string>("");
  const [confirmPasswordStyle, setConfirmPasswordStyle] = useState<string>("");

  const [personPossession] = useState<string>(accountType === 'admin' ? `the admin's` : `the student's`)
  const [personPOV] = useState<string>(accountType === 'admin' ? `the admin's` : `the teacher's`)
  
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
        clearHighlighting();
        clearForm();
      },
      reject: () => {}
    });

  };

  // Async function to handle the form submission
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

    for (var i = 0; i < schoolCodes.length; i++)
    {
       // Ensure the entered school code is valid
       const results: SchoolSearch = await schoolSearcher(schoolCodes[i]);
       if (results.errored) {
       detailValidationError("error", "Unexpected Error Occurred", "The school code you entered is invalid. Please check your code is correct and try again.");
       setSchoolCodes([]);
       unlock(); return;
       };
    }

    // Ensure a valid school has been detected and assigned
    if (schoolNames.length === 0) {
      detailValidationError("warn", "No School Detected", `Ensure you detect your school by searching with a school code before creating ${personPossession} account.`);
      unlock(); return;
    };

    // Ensure a first name has been provided
    if (firstName === "") {
      detailValidationError("warn", "Invalid First Name", "You have not entered a first name. Please provide a first name and try again.");
      setFirstNameStyle("p-invalid");
      unlock(); return;
    };

    // Ensure a surname initial has been provided
    if (surname === "" || surname === null) {
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
    const creationResults: boolean = await createStaffAccount(accountType, schoolCodes, schoolNames, firstName, surname, username, password);
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
    setSchoolCodes([]);
    setSchoolNames([]);
    setFirstName("");
    setSurname("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setLoadingClear(false);
    return;
  };

  function removeSchool(removeSchoolName : string) {
    let updatedSchoolNames = [...schoolNames]; // Create a copy of the current state
    let updatedCodes = [...schoolCodes];

    for (var i = 0; i < schoolCodes.length; i++)
      {
        if (schoolNames[i] === removeSchoolName )
          {
            updatedSchoolNames.splice(i, 1);
            updatedCodes.splice(i, 1);
            setSchoolCodes(updatedCodes);
            setSchoolNames(updatedSchoolNames);
            console.log(schoolCodes)
            console.log(schoolNames)
            return;
          }
      }
  }

  // Async function to handle searching for a school based on a given school code
  async function schoolSearchHandler(code : string): Promise<void> {
    setLoadingSchoolSearch(true);

    // Attempt to retrieve the name of the school that matches the given ID
    const results: SchoolSearch = await schoolSearcher(code);
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
      setSchoolCodes([]);
      setLoadingSchoolSearch(false); return;
    };

    // Update the school name field on the creation form
    let updatedSchoolNames = [...schoolNames]; // Create a copy of the current state
    updatedSchoolNames.push(results.schoolName); // Add the new school name
    setSchoolNames(updatedSchoolNames); // Update the state with the new array

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
    if (firstName === "" || surname === null || surname === "") {
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
    const genUsername: UsernameGen = await generateUsername(firstName, surname);
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
    if (firstName === "" || surname === null || surname === "") {
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
    const genPassword: string = generatePassword(firstName, surname);
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
    setFirstNameStyle("");
    setSurnameStyle("");
    setUsernameStyle("");
    setPasswordStyle("");
    setConfirmPasswordStyle("");
    return;
  };

//   const checkNewSchool = (e : any) => {
//     const regex = /^\d{2}-\d{2}-\d{2}$/;
//     if (regex.test(e) === true) {
//         const newSchool = [...schoolCodes, e];
//         setSchoolCodes(newSchool);
// }
//   };

  // Return JSX
  return (
    <BlockUI blocked={blockForm}>
    <Toast ref={toast} />
    <Card title={`Create New ${accountType} Account`} subTitle={`Enter ${personPossession} details:`} style={{ display: 'block' }}>
      <div className="p-inputgroup flex-1">
        <span className="p-float-label">
        <Chips
          value={schoolCodes}
          placeholder='Format: 00-00-00'
          onRemove={(e) => {
          let index: number = -1;
          for(let i = 0; i < schoolCodes.length; i++) {
            if(schoolCodes[i] === e.value) 
              index = i;
          };
          schoolCodes.splice(index, 1);
          setSchoolCodes(schoolCodes)
          }}
          onAdd={(e) => schoolSearchHandler(e.value)}
          />
          <label htmlFor="school_code_inp">School Code</label>
        </span>
      </div>
      <small id="school-code-help2" className='creation-form-help-text'>
        Enter the 6-digit code that {personPossession} school or instructor has provided.
      </small>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <ListBox 
              options={schoolNames} 
              style={{textAlign:"center", width: "100%"}} 
              emptyMessage="No schools added"
              onChange={(e) => removeSchool(e.value)} // function to remove school
                />
              <Button label="Clear" icon="pi pi-times" onClick={() => {
                setSchoolNames([]);
                setSchoolCodes([]);
              }} severity="secondary"/>
            </span>
        </div>
        <small id="school-name-help2" className='creation-form-help-text'>
          {personPossession[0].toUpperCase()}{personPossession.substring(1)} schools name will be filled in automatically.
        </small>
      </div>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="first-name2"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value.toUpperCase())}
              required
              className={firstNameStyle}
              aria-describedby='first-name-help2'
            />
            <label htmlFor="first-name2">First Name</label>
          </span>
        </div>
        <small id="first-name-help2" className='creation-form-help-text'>
          Enter just {personPossession} first name.
        </small>
      </div>
      

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="surname-initial2"
              value={surname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSurname(e.target.value?.toUpperCase())}
              required
              className={surnameStyle}
              aria-describedby='surname-help2'
            />
            <label htmlFor="surname-initial2">Surname</label>
          </span>
        </div>
        <small id="surname-help2" className='creation-form-help-text'>
          Enter just the first letter of {personPossession} surname.
        </small>
      </div>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="creation-username2"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
              className={usernameStyle}
              aria-describedby='username-help2'
            />
            <label htmlFor="creation-username2">Username</label>
            <Button label='Generate' icon="pi pi-sync" loading={loadingUsernameGen} onClick={() => {
              setUsernameStyle("");
              setFirstNameStyle("");
              setSurnameStyle("");
              usernameGenerationHandler();
            }} severity="info"/>
          </span>
        </div>
        <small id="username-help2" className='creation-form-help-text'>
          Create {personPossession} username or have one generated based on {personPossession} name.
        </small>
      </div>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <Password
              id="creation-password2"
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
            <label htmlFor="creation-password2">Password</label>
            <Button label='Generate' icon="pi pi-sync" loading={loadingPasswordGen} onClick={() => {
              setPasswordStyle("");
              setFirstNameStyle("");
              setSurnameStyle("");
              passwordGenerationHandler();
            }} severity="info"/>
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
              id="confirm-password2"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
              toggleMask
              feedback={false}
              className={confirmPasswordStyle}
              aria-describedby='confirm-password-help'
            />
            <label htmlFor="confirm-password2">Confirm Password</label>
          </span>
        </div>
        <small id="confirm-password-help2" className='creation-form-help-text'>
          Re-enter {personPossession} password to confirm it's correct.
        </small>
      </div>


      <div className="student-creation-form-button-field">
        <div className="student-creation-form-button">
          <Button label="Create" icon="pi pi-check" loading={loadingCreation} onClick={() => {
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
            if (schoolCodes !== null || firstName !== "" || surname !== "" || username !== "" || password !== "" || confirmPassword !== "") {
              confirmFormClose();
            } else {
              clearHighlighting();
              clearForm();
            };
          }} raised severity="secondary"/>
        </div>
      </div>
    </Card>
    </BlockUI>
  );
};

export default StaffCreationForm;
