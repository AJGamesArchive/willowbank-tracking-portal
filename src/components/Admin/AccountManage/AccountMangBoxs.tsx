// Import core functions
import { isUniqueUsernameName } from '../../../functions/Validation/IsUniqueUsername';
import { updateCoreAccountDetails } from '../../../functions/Global/UpdateCoreAccountDetails';
import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { BlockUI } from 'primereact/blockui';
import { Toast } from 'primereact/toast';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';

// Import types
import { CoreStaffAccountDetails } from '../../../types/Global/UserAccountDetails';
import { CoreStudentAccountDetails } from '../../../types/Global/UserAccountDetails';

// Import CSS
import './AccountMangBoxs.css';
import { removeAccount } from '../../../functions/Admin/removeAccount';

interface AccountListBoxProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  selectedUserStudent: CoreStudentAccountDetails;
  selectedUserStaff: CoreStaffAccountDetails;
  selectedCategory: string;
  callback: (value : boolean) => void;
};

// React function to render the edit account details dialog box for admins
const AccountManageBoxs: React.FC<AccountListBoxProps> = ({visible, setVisible, selectedUserStudent, selectedUserStaff, selectedCategory, callback}) => {
  // Variables to control toast messages
  const toast = useRef<Toast>(null);

  // State variables to store editable account details
  const [snowflake, setSnowflake] = useState<string>('');
  const [username, setUsername] = useState<string>("");
  const [existingUsername, setExistingUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>("");
  const [surnameInitial, setSurnameInitial] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  var [school, setSchool] = useState<string[]>([]);

  // State variable to control the submitted state of the form
  const [loading, setLoading] = useState<boolean>(false);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [resultPopupVisible, setResultPopupVisible] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

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

  // Async function to handel updating core account details 
  async function updateCoreDetailsHandler(): Promise<void> {
    // Handle and validate differing data depending on mode
    let success: boolean = false;
    // Set loading states
    setLoading(true);

    if (!username || !firstName || !surnameInitial) {
      toast.current?.show({
        severity: `warn`,
        summary: `Missing Data`,
        detail: `Some data required for an account is missing. Please ensure you have filled out all form fields.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });
      return;
    };

    if (username !== existingUsername) {
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

    if (surnameInitial.length !== 1 && selectedCategory === 'students' ) {
      toast.current?.show({
        severity: `warn`,
        summary: `Invalid surnameInitial`,
        detail: `You must only enter the first letter of your last name.`,
        closeIcon: 'pi pi-times',
        life: 7000,
      });

      setLoading(false); 
      return;
    };

    // Try to update the account details
    success = await updateCoreAccountDetails(selectedCategory, snowflake, firstName, surnameInitial, username, password, school);
    // Ensure process completed successfully
    if(!success) {
      unexpected();
      setLoading(false); 
      return;
    };
    setLoading(false);
    toast.current?.show({
      severity: `success`,
      summary: `Account Updated`,
      detail: `The account details for ${username} have been updated successfully.`,
      closeIcon: 'pi pi-times',
      life: 7000,
    });
    setVisible(false);
    callback(true);
    return;
  };

  // Control some variable states upon the dialogue box being hidden
  const onDialogueHide = () => {
    setVisible(false);
    setLoading(false);
    setPassword("");
  };

  // Async function to handel prepping account deletion
  async function RemoveAccount (snowflake : string) {
    if (await removeAccount(snowflake, selectedCategory)) {
      setResult("was");
      callback(true);
    } else {
      setResult("was not");
      callback(false);
    };
    setResultPopupVisible(true);
  };

  // Function to map the passed data to input form fields
  function getUserDetails(): void {
    switch(selectedCategory) {
      case "students":
        setSnowflake(selectedUserStudent.snowflake);
        setUsername(selectedUserStudent.username);
        setExistingUsername(selectedUserStudent.username);
        setFirstName(selectedUserStudent.firstName);
        setSurnameInitial(selectedUserStudent.surnameInitial);
        setSchool([selectedUserStudent.school]);
        break;
      default:
        setSnowflake(selectedUserStaff.snowflake);
        setUsername(selectedUserStaff.username);
        setExistingUsername(selectedUserStaff.username);
        setFirstName(selectedUserStaff.firstName);
        setSurnameInitial(selectedUserStaff.surname);
        setSchool(selectedUserStaff.schools);
        break;
    };
    return;
  };

  // useEffect hook to handel setting up the dialogue box upon the box being shown
  useEffect(() => {
    if(visible) {
      getUserDetails();
    };
  }, [visible]);

  // Function to check a new school on chip input
  const checkNewSchool = (e : any) => {
    const regex = /^\d{2}-\d{2}-\d{2}$/;
    if (regex.test(e) === true) {
      const newSchool = [...school, e];
      setSchool(newSchool);
    };
  };

  // Returning core JSX
  return (
    <div>
      <BlockUI blocked={true}>
        <Toast ref={toast}/>
        <Dialog 
          visible={visible}
          resizable={false} 
          draggable={false} 
          closeIcon='pi pi-times' 
          style={{ width: '32rem' }} 
          breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
          header={`Edit Account Details:`} 
          modal 
          onHide={onDialogueHide}
          className="p-fluid"
        >

          <div>
            <label>Username</label>
            <InputText
              id='edit-account-username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus 
            />
          </div>

          <div>
            <label>First Name</label>
            <InputText
              id='edit-account-firstName'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value.toUpperCase())}
              autoFocus
            />
          </div>

          <div>
            <label>Last Name</label>
            {selectedCategory === 'students' ? (
              <InputText
              id='edit-account-lastName'
              value={surnameInitial}
              onChange={(e) => setSurnameInitial(e.target.value.toUpperCase())}
              autoFocus
              />
            ) : (
              <InputText
              id='edit-account-lastName'
              value={surnameInitial}
              onChange={(e) => setSurnameInitial(e.target.value.toUpperCase())}
              autoFocus
              />
            )}
          </div>

          <div>
            <label>School</label>
            {selectedCategory === 'students' ? (
              <InputMask
                  id='edit-account-school'
                  value={school[0]}
                  mask="99-99-99"
                  onChange={(e: InputMaskChangeEvent) => {
                  school[0] = (e.target.value) ? e.target.value : '';
                  setSchool(school);
                }}
              />
            ) : (
              <Chips
                value={school}
                placeholder='Format: 00-00-00'
                onRemove={(e) => {
                let index: number = -1;
                for(let i = 0; i < school.length; i++) {
                    if(school[i] === e.value) index = i;
                };
                school.splice(index, 1);
                setSchool(school);
                }}
                onAdd={(e) => checkNewSchool(e.value)}
              />
            )}
          </div>

          <div>
            <label>Password</label>
            <InputText
              id='edit-account-password'
              placeholder='Password Hidden Enter input to change password'
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
              autoFocus
            />
          </div>
          <Button label="Update Details" loading={loading} icon="pi pi-save" severity='success' onClick={updateCoreDetailsHandler} style={{width: "48%", margin: "5px"}}/>
          <Button label="Delete account" icon="pi pi-trash" severity='danger' onClick={() => setPopupVisible(true)} style={{width: "48%", margin: "5px"}}/>
        </Dialog>

        <Dialog
          visible={popupVisible}
          onHide={() => {setPopupVisible(false)}}
          header="Delete Account"
          closeIcon="pi pi-times"
        >
          <p>Are you sure you want to delete this account?</p>
          <Button label="Yes" onClick={() => {RemoveAccount(snowflake); setResultPopupVisible(true), setPopupVisible(false)}} severity='danger' style={{margin: "5px"}}/>
          <Button label="No" onClick={() => setPopupVisible(false)} style={{margin: "5px"}}/>
        </Dialog>

        <Dialog
          visible={resultPopupVisible}
          onHide={() => {setResultPopupVisible(false); setVisible(false)}}
          header="Delete Account"
          closeIcon="pi pi-times"
        >
          <p>The account {result} deleted.</p>
        </Dialog>
      </BlockUI>
    </div>
  );
};

export default AccountManageBoxs;