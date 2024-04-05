// Import core functions
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';

// Import CSS
import './StudentCreateAccount.css';

// React function to render the student login form
const StudentCreationForm: React.FC = () => {
  // Variables to store the required login credentials
  const [schoolCode, setSchoolCode] = useState<any>();
  const [schoolName, setSchoolName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Variables to control the loading state of the form buttons
  const [loadingCreation, setLoadingCreation] = useState<boolean>(false);
  const [loadingClear, setLoadingClear] = useState<boolean>(false);
  const [loadingSchoolSearch, setLoadingSchoolSearch] = useState<boolean>(false);

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
  async function creationHandler() {
    setLoadingCreation(true);
    setBlockForm(true);
    setTimeout(() => {
      setLoadingCreation(false);
      setBlockForm(false);
    }, 2000);
    return;
  };

  // Function to clear the form
  function clearForm() {
    setLoadingClear(true);
    setSchoolCode(null);
    setSchoolName("");
    setUsername("");
    setPassword("");
    setLoadingClear(false);
    formCleared();
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

  // Return JSX
  return (
    <BlockUI blocked={blockForm}>
    <Card title='Create New Account' subTitle='Enter your details:'>
      <div className="p-inputgroup flex-1">
        <span className="p-float-label">
          <InputMask 
            id="school_code_input"
            value={schoolCode} 
            onChange={(e: InputMaskChangeEvent) => setSchoolCode(e.target.value)}
            mask="99-99-99"
            slotChar="00-00-00"
          />
          <label htmlFor="school_code_input">School Code</label>
          <Button label='Search' icon="pi pi-search" loading={loadingSchoolSearch} onClick={schoolSearchHandler} severity="info"/>
        </span>
      </div>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="school-name"
              value={schoolName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolName(e.target.value)}
              required
              disabled
            />
            <label htmlFor="school-name">School Name</label>
            <Button label="Clear" icon="pi pi-times" onClick={() => {setSchoolName("")}} severity="secondary"/>
          </span>
        </div>
      </div>

      <div className="student-creation-form-field">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="creation-username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="creation-username">Username</label>
          </span>
        </div>
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
            />
            <label htmlFor="creation-password">Password</label>
          </span>
        </div>
      </div>

      <div className="student-creation-form-button-field">
        <div className="student-creation-form-button">
          <Toast ref={toast} />
          <Button label="Login" icon="pi pi-check" loading={loadingCreation} onClick={creationHandler} raised severity="info"/>
        </div>
        <div className="student-creation-form-button">
          <Toast ref={toast}/>
          <Button label="Clear" icon="pi pi-exclamation-triangle" loading={loadingClear} onClick={clearForm} raised severity="warning"/>
        </div>
      </div>
    </Card>
    </BlockUI>
  );
};

export default StudentCreationForm;
