// Import core functions
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { BlockUI } from 'primereact/blockui';
import { classNames } from 'primereact/utils';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';

// Importing <Password> UI Props
import { passwordStrengthMsgs, passwordSuggestionsHeader, passwordSuggestionsFooter } from '../../data/PasswordSuggestions';

// Import CSS
import './EditAccountDetails.css'

// Importing function
import { generateUsername } from '../../functions/Login/GenerateUsername';
import { generatePassword } from '../../functions/Login/GeneratePassword';
import { updateCoreAccountDetails } from '../../functions/Global/UpdateCoreAccountDetails';
import { isUniqueUsernameName } from '../../functions/Validation/IsUniqueUsername';

// Importing types
import { UsernameGen } from '../../types/Login/UsernameGen';

// Interface to define the data pass through's for the edit account details component
interface EditAccountDetailsProps {
  accountType: string;
  snowflake: string;
  token: string
  existingFirstName: string;
  existingSurnameI: string
  existingUsername: string;
  existingPassword: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  setIsLoggedIn: (value: boolean) => void;
  setDetailConfirmation: (value: boolean) => void;
};

// React function to render the edit account details dialogue box
const EditAccountDetails: React.FC<EditAccountDetailsProps> = ({accountType, snowflake, token, existingFirstName, existingSurnameI, existingUsername, existingPassword, visible, setVisible, setIsLoggedIn, setDetailConfirmation}) => {
  // Variable to control the edit mode of the form
  const [mode, setMode] = useState<string>("c"); // c = confirm password, e = edit details, p = update password

  // State variables to store editable account details
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [surnameInitial, setSurnameInitial] = useState<any>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  // State variable to control the submitted state of the form
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUsernameGen, setLoadingUsernameGen] = useState<boolean>(false);
  const [loadingPasswordGen, setLoadingPasswordGen] = useState<boolean>(false);

  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // Async function to handel updating given account details
  async function updateCoreDetailsHandler(): Promise<void> {
    // Set loading states
    setSubmitted(true);
    setLoading(true);
    // Define unexpected error message
    const unexpected = () => {
      toast.current?.show({
        severity: `error`,
        summary: `Unexpected Error`,
        detail: `An unexpected error occurred while trying to update account details. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
    };
    // Handel and validate differing data depending on mode
    let success: boolean = false;
    switch(mode) {
      case "e":
        // Ensure first name, surname initial, and username all have a value
        if(!firstName || !surnameInitial || !username) {
          toast.current?.show({
            severity: `warn`,
            summary: `Missing Details`,
            detail: `You cannot remove your: first name, surname initial, or username. Please ensure all fields have a value.`,
            closeIcon: 'pi pi-times',
            life: 7000,
          });
          setLoading(false); return;
        };
        // Ensure username is unique if it's being updated
        if(username.toUpperCase() !== existingUsername.toUpperCase()) {
          const isUnique = await isUniqueUsernameName(username);
          if(typeof isUnique === "string") {
            unexpected();
            setLoading(false); return;
          };
          if(!isUnique) {
            toast.current?.show({
              severity: `warn`,
              summary: `Invalid Username`,
              detail: `The username you entered is not unique. Please enter a unique username.`,
              closeIcon: 'pi pi-times',
              life: 7000,
            });
            setLoading(false); return;
          };
        };
        // Update database
        success = await updateCoreAccountDetails(accountType, snowflake, firstName, surnameInitial, username, undefined,undefined);
        break;
      case "p":
        // Ensure a password has been entered
        if(!newPassword || !confirmNewPassword) {
          toast.current?.show({
            severity: `warn`,
            summary: `Missing Details`,
            detail: `You cannot remove your password. Please ensure you have entered and confirmed your new password.`,
            closeIcon: 'pi pi-times',
            life: 7000,
          });
          setLoading(false); return;
        };
        // Ensure you have confirmed your new password
        if(newPassword !== confirmNewPassword) {
          toast.current?.show({
            severity: `warn`,
            summary: `Unconfirmed Password`,
            detail: `The passwords you have entered do not match. Please ensure you enter the same password twice.`,
            closeIcon: 'pi pi-times',
            life: 7000,
          });
          setLoading(false); return;
        };
        // Ensure the password is different to your old password
        if(newPassword === existingPassword) {
          toast.current?.show({
            severity: `warn`,
            summary: `Unchanged Password`,
            detail: `Your new password cannot be the same as your old password.`,
            closeIcon: 'pi pi-times',
            life: 7000,
          });
          setLoading(false); return;
        };
        // Update database
        success = await updateCoreAccountDetails(accountType, snowflake, undefined, undefined, undefined, newPassword,undefined);
        break;
      default:
        // Handel invalid modes being active
        unexpected();
        setLoading(false); return;
    };
    // Ensure process completed successfully
    if(!success) {
      unexpected();
      setLoading(false); return;
    };
    // Wait for 3 seconds to allow confirmation messages to be displayed and read
    setIsLoggedIn(false);
    setDetailConfirmation(true);
    setVisible(false);
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Re-log account
    switch(accountType) {
      case "admins":
        window.location.href = `/adminportal/${snowflake}/${token}/${firstName}`;
        break;
      case "teachers":
        window.location.href = `/teacherportal/${snowflake}/${token}/${firstName}`;
        break;
      case "students":
        window.location.href = `/studenthome/${snowflake}/${token}/${firstName}`;
        break;
      default:
        window.location.href = `/home`;
        break;
    };
    return;
  };

  // Async function to handel username generation
  async function usernameGenHandler(): Promise<void> {
    setSubmitted(true);
    setLoadingUsernameGen(true);
    if(!firstName || !surnameInitial) {
      toast.current?.show({
        severity: `warn`,
        summary: `Missing Details`,
        detail: `You must enter a first name and surname initial to be able to generate a username.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setLoadingUsernameGen(false); return;
    };
    const genUsername: UsernameGen = await generateUsername(firstName, surnameInitial);
    if(!genUsername.success) {
      toast.current?.show({
        severity: `error`,
        summary: `Unexpected Error`,
        detail: `An unexpected error occurred while trying to generate a username. Please try again.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      setLoadingUsernameGen(false); return;
    };
    setUsername(genUsername.name);
    toast.current?.show({
      severity: `success`,
      summary: `Username Generated`,
      detail: `Your username was generated successfully.`,
      closeIcon: 'pi pi-times',
      life: 7000,
    });
    setLoadingUsernameGen(false); return;
  };

  // Function to handel password generation
  function passwordGenHandler(): void {
    setLoadingPasswordGen(true);
    const genPassword: string = generatePassword(existingFirstName, existingSurnameI);
    setNewPassword(genPassword);
    toast.current?.show({
      severity: `success`,
      summary: `Password Generated`,
      detail: `The password '${genPassword}' was generated successfully.`,
      closeIcon: 'pi pi-times',
      life: 7000,
    });
    setLoadingPasswordGen(false); return;
  };

  // useEffect hook to update student details printed on the form each time the dialogue box is called
  useEffect(() => {
    if(visible) {
      setUsername(existingUsername);
      setFirstName(existingFirstName);
      setSurnameInitial(existingSurnameI);
      if(!snowflake || !token) setVisible(false);
    };
  }, [visible]);

  // Reset submission state each time the dialogue mode changes
  useEffect(() => {
    setSubmitted(false);
  }, [mode]);

  // Function to control events triggered by the dialogue box being hidden
  const onDialogueHide = () => {
    setVisible(false);
    setSubmitted(false);
    setLoading(false);
    setMode("c");
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  // Function to manage the dialogue footers depending on what mode is active
  const footerManager = () => {
    switch(mode) {
      case "e":
        return editDetailsFooter;
      case "p":
        return updatePasswordFooter;
      default:
        return confirmPasswordFooter;
    };
  };

  // Template to define the footer of the dialogue box when in password confirmation mode (c)
  const confirmPasswordFooter = (
    <React.Fragment>
      <BlockUI blocked={loading}>
        <Button label="Cancel" icon="pi pi-times" onClick={onDialogueHide} severity='secondary' />
        <Button label="Confirm" loading={loading} icon="pi pi-unlock" severity='info' onClick={() => {
          setSubmitted(true);
          if(password !== existingPassword) {
            toast.current?.show({
              severity: `warn`,
              summary: `Password Incorrect`,
              detail: `The password you entered is incorrect. Please try again.`,
              closeIcon: 'pi pi-times',
              life: 7000,
            });
            return;
          };
          setMode("e");
          setPassword("");
          setSubmitted(false);
        }} />
      </BlockUI>
    </React.Fragment>
  );

  // Template to define the footer of the dialogue box when in detail editing mode (e)
  const editDetailsFooter = (
    <React.Fragment>
      <BlockUI blocked={loading}>
        <Button label="Cancel" icon="pi pi-undo" onClick={onDialogueHide} severity='secondary' />
        <Button label="Update Details" loading={loading} icon="pi pi-save" severity='success' onClick={updateCoreDetailsHandler} />
      </BlockUI>
    </React.Fragment>
  );

  // Template to define the footer of the dialogue box when in password update mode (p)
  const updatePasswordFooter = (
    <React.Fragment>
      <BlockUI blocked={loading}>
        <Button label="Cancel" icon="pi pi-undo" onClick={() => setMode("e")} severity='secondary' />
        <Button label="Update Password" loading={loading} icon="pi pi-check-circle" severity='success' onClick={updateCoreDetailsHandler} />
      </BlockUI>
    </React.Fragment>
  );

  // Returning core JSX
  return (
    <BlockUI blocked={true}>
      <Toast ref={toast}/>
      <Dialog 
        visible={visible} 
        resizable={false} 
        draggable={false} 
        closeIcon='pi pi-times' 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Edit Your Account Details:`} 
        modal 
        className="p-fluid" 
        footer={footerManager} 
        onHide={onDialogueHide}
      >
        <BlockUI blocked={loading}>
          {
            /*
              Initial Confirm Password form
              Only visible when in mode (c) - Confirm Password Mode
            */
          }
          {mode === "c" && <div>
            <label htmlFor="edit-account-confirm-existing-password" className="font-bold">
              Enter your Password
            </label>
            <Password 
              id="edit-account-confirm-existing-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
              feedback={false}
              toggleMask
              className={classNames({ 'p-invalid': submitted && !password })} 
            />
            {submitted && !password && <small className="p-error">You must confirm your password.</small>}
          </div>}
          {
            /*
              Edit account details form
              Only visible when in mode (e) - Edit Details Mode
            */
          }
          {mode === "e" && <div>
            <div>
              <label htmlFor="edit-account-first-name" className="font-bold">
                First Name
              </label>
              <InputText 
                id="edit-account-first-name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value.toUpperCase())} 
                required 
                autoFocus 
                className={classNames({ 'p-invalid': submitted && !firstName })} 
              />
              {submitted && !firstName && <small className="p-error">First name must be filled in.</small>}
            </div>

            {accountType === "students" && <div className="edit-account-data">
              <label htmlFor="edit-account-surname" className="font-bold">
                Surname Initial
              </label>
              <InputMask 
                id="edit-account-surname"
                value={surnameInitial}
                onChange={(e: InputMaskChangeEvent) => setSurnameInitial(e.target.value?.toUpperCase())}
                mask="a"
                className={classNames({ 'p-invalid': submitted && !surnameInitial })} 
              />
              {submitted && !surnameInitial && <small className="p-error">Surname initial must be filled in.</small>}
            </div>}

            {accountType !== "students" && <div className="edit-account-data">
              <label htmlFor="edit-account-surname" className="font-bold">
                Surname
              </label>
              <InputText
                id="edit-account-surname"
                value={surnameInitial}
                onChange={(e) => setSurnameInitial(e.target.value?.toUpperCase())}
                className={classNames({ 'p-invalid': submitted && !surnameInitial })} 
              />
              {submitted && !surnameInitial && <small className="p-error">Surname initial must be filled in.</small>}
            </div>}

            <div className="edit-account-data">
              <label htmlFor="edit-account-username" className="font-bold">
                Username
              </label>
              <div className="p-inputgroup flex-1">
                <InputText 
                  id="edit-account-username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={classNames({ 'p-invalid': submitted && !username })}
                />
                <Button label='Generate' icon="pi pi-sync" loading={loadingUsernameGen} onClick={usernameGenHandler} severity="info"/>
              </div>
              {submitted && !username && <small className="p-error">Username must be filled in.</small>}
            </div>

            <div className="edit-account-data">
              <Button label="Change Password" icon="pi pi-pencil" onClick={() => setMode("p")} severity='info' />
            </div>
          </div>}
          {
            /*
              Update password form
              Only visible when in mode (p) - Update Password Mode
            */
          }
          {mode === "p" && <div>
            <div>
              <div className="p-inputgroup flex-1">
                <span className="p-float-label">
                  <label htmlFor="edit-account-password" className="font-bold">
                    Enter New Password
                  </label>
                  <Password 
                    id="edit-account-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    autoFocus
                    toggleMask
                    header={passwordSuggestionsHeader}
                    footer={passwordSuggestionsFooter}
                    promptLabel={passwordStrengthMsgs.prompt}
                    weakLabel={passwordStrengthMsgs.weak}
                    mediumLabel={passwordStrengthMsgs.medium}
                    strongLabel={passwordStrengthMsgs.strong}
                    className={classNames({ 'p-invalid': submitted && !newPassword })} 
                  />
                  <Button label='Generate' icon="pi pi-sync" loading={loadingPasswordGen} onClick={passwordGenHandler} severity="info"/>
                </span>
              </div>
              {submitted && !newPassword && <small className="p-error">You must enter a new password.</small>}
            </div>

            <div className="edit-account-data">
              <label htmlFor="edit-account-confirm-password" className="font-bold">
                Confirm New Password
              </label>
              <Password 
                id="edit-account-confirm-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)} 
                required
                feedback={false}
                toggleMask
                className={classNames({ 'p-invalid': submitted && !confirmNewPassword })} 
              />
              {submitted && !confirmNewPassword && <small className="p-error">You must confirm your new password.</small>}
            </div>
          </div>}
        </BlockUI>
      </Dialog>
    </BlockUI>
  );
};

export default EditAccountDetails;
