// Import core functions

import { isUniqueUsernameName } from '../../../functions/Validation/IsUniqueUsername';
import { updateCoreAccountDetails } from '../../../functions/Global/UpdateCoreAccountDetails';
// --import { useState } from 'react';
import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { getUserData } from '../../../functions/Admin/accountInformation';
import { UserData } from '../../../functions/Admin/accountInformation';
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
    selectedUsername: CoreStudentAccountDetails | CoreStaffAccountDetails;
    setSelectedUsername: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    callback: (value : boolean) => void;
}
    //creates usestates for the selected users information
    const AccountManageBoxs: React.FC<AccountListBoxProps> = ({selectedUsername, setSelectedUsername,selectedCategory,setSelectedCategory, callback}) => {
    const [userData, setUserData] = useState<UserData>();

    // Variables to control toast messages
    const toast = useRef<Toast>(null);

    // State variables to store editable account details
    const [username, setUsername] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [surnameInitial, setSurnameInitial] = useState<any>("");
    const [password, setPassword] = useState<string>("");
    var [school, setNewSchool] = useState<string[]>([]);

    // State variable to control the submitted state of the form
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [Visible, setVisible] = useState<boolean>(true)
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [resultPopupVisible, setResultPopupVisible] = useState<boolean>(false);
    const [result, setResult] = useState<string>("")

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


    async function updateCoreDetailsHandler(): Promise<void> {

    // Handle and validate differing data depending on mode
    let success: boolean = false;
    // Set loading states
    setSubmitted(true);
    setLoading(true);

        if (!username || !firstName || !surnameInitial || !password )
            {
                toast.current?.show({
                    severity: `error`,
                    summary: `Unexpected Error`,
                    detail: `An unexpected error occurred while trying to update account details. Please try again.`,
                    closeIcon: 'pi pi-times',
                    life: 7000,
                  });
            }
        if (username !== userData?.username)
            {
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
                }
            }
        if (surnameInitial.length !== 1 && selectedCategory === 'students' )
            {
                toast.current?.show({
                    severity: `warn`,
                    summary: `Invalid surnameInitial`,
                    detail: `You must only enter the first letter of your last name.`,
                    closeIcon: 'pi pi-times',
                    life: 7000,
                    });
                    setLoading(false); return;
            }
            success = await updateCoreAccountDetails(selectedCategory,String(userData?.snowflake),firstName, surnameInitial, username, password,school);
            // Ensure process completed successfully
            if(!success) {
                unexpected();
                setLoading(false); return;
            };
            setLoading(false); return;
        }
        

    const onDialogueHide = () => {
        setVisible(false);
        setSubmitted(false);
        setLoading(false);
        setPassword("");
      };

    async function RemoveAccount (snowflake : string, accountType : string) {
        if (await removeAccount(snowflake, accountType))
        {
            setResult("was");
            callback(true);
        }
        else {
            setResult("was not");
            callback(false);
        }
        setResultPopupVisible(true);
    }
    
    //use effects runs when component is called
    useEffect(() => {
        if (selectedUsername && selectedCategory) {
            getUserData(selectedUsername.snowflake, selectedCategory)
                .then((data) => {
                    if(typeof data !== "string") {
                        setUserData(data);
                        setVisible(true);
                        setFirstName(String(data?.firstName))
                        setUsername(String(data?.username))
                        if(selectedCategory === "students") {
                            school = [data.school];
                            setSurnameInitial(String(data?.surnameInitial))
                        } else {
                            console.log('data:' , data.school);
                            school = data.schools;
                            console.log('schools:', school)
                            setSurnameInitial(String(data?.surname))
                        }
                        setNewSchool(school)
                        setPassword(String(data?.password))
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
            } else {
                // Clear userData when selectedUsername is null
                setUserData(null as unknown as UserData | undefined);
            }
    },[selectedUsername, selectedCategory]);
    
      const checkNewSchool = (e : any) => {
        const regex = /^\d{2}-\d{2}-\d{2}$/;
        if (regex.test(e) === true) {
            const newSchool = [...school, e];
        setNewSchool(newSchool);
        console.log('checknewschool',newSchool)
  }
      };

    return (
        (userData && <div>
        <BlockUI blocked={true}>
            <Toast ref={toast}/>
            <Dialog 
                visible={Visible}
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
                    <label>
                        Username
                    </label>
                    <InputText
                    id='edit-account-username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toUpperCase())}
                    autoFocus 
                    />
                </div>   

               <div>
                    <label>
                        First Name
                    </label>
                    <InputText
                    id='edit-account-firstName'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value.toUpperCase())}
                    autoFocus
                    />
                </div>

                <div>
                    <label>
                        Last Name 
                    </label>
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
                    <label>
                        School
                    </label>
                    {selectedCategory === 'students' ? (
                        <InputMask
                            id='edit-account-school'
                            value={school[0]}
                            mask="99-99-99"
                            slotChar='00-00-00'
                            onChange={(e: InputMaskChangeEvent) => {
                            school[0] = (e.target.value) ? e.target.value : '';
                            setNewSchool(school);
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
                            setNewSchool(school)
                           }}
                           onAdd={(e) => checkNewSchool(e.value)}
                           
                           />
                        )}
                </div>

                <div>
                    <label>
                        Password
                    </label>
                    <InputText
                    id='edit-account-password'
                    value={password}
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
                <Button label="Yes" onClick={() => {RemoveAccount(userData?.snowflake, selectedCategory); setResultPopupVisible(true), setPopupVisible(false)}} severity='danger' style={{margin: "5px"}}/>
                <Button label="No" onClick={() => setPopupVisible(false)} style={{margin: "5px"}}/>
            </Dialog>

            <Dialog
                visible={resultPopupVisible}
                onHide={() => {setResultPopupVisible(false); setVisible(false)}}
                header="Delete Account"
                closeIcon="pi pi-times">
                <p>The account {result} deleted.</p>
            </Dialog>
        </BlockUI>
        </div>)
    );
};

export default AccountManageBoxs;