import './ResetPasswordList.css'
import React, { useEffect } from 'react';
import { ListBox } from 'primereact/listbox';
import { PasswordRequest } from '../../types/Global/PasswordRequest.ts';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { removeResetRequest, resetPassword } from '../../functions/Global/DBUpdatePasswordRequests.ts';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import { getResetRequests } from '../../functions/Global/GetResetRequests.ts';

const ResetList : React.FC = () => {
    useEffect(() => {
        aGetRequests();
        return;
    }, []);
    // Use state constant declarations
    const [errorDialogVisible, setDialogVisible] = useState<boolean>(false);
    const [resetPopupVisible, setPopupVisible] = useState<boolean>(false);
    const [ignorePasswordDisplayVisible, setIgnorePasswordDisplayVisible] = useState<boolean>(false);
    const [passwordDisplayVisible, setPasswordDisplayVisible] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("")
    const [request, setRequests] = useState<PasswordRequest[]>([]);
    const [account, setAccount] = useState<PasswordRequest>({
        snowflake: "",
        username: "test",
        accountType: "",
        created: ""
    });

    async function aGetRequests ()
    {
        const requestsArray = await getResetRequests();
        if ( typeof requestsArray === "string")
            {
                return;
            }
        setRequests(requestsArray)
        return;
    }

    // Calls removeResetRequest, which tries to remove the given account
    // from the request array and update the database
    // Returns void
    async function removeResetRequestHandler( account : PasswordRequest ) {    
        const output = await removeResetRequest(account, true, "");
        if (!output) {
            setPopupVisible(true)
        }
        else {
            setIgnorePasswordDisplayVisible(true)
        }
        return;
    }

    async function resetPasswordHandler ( account : PasswordRequest )
    {
        const newPassword = await resetPassword(account);
        if (newPassword === "") {
            setPopupVisible(true);
        }
        else
        {
            setPassword(newPassword);
            setPasswordDisplayVisible(true);
            removeResetRequest(account, false, newPassword);
        };
        return;
    };
    
    // Called by Dialog if admin chooses to reset the user's password
    const accept = async () => {
        await resetPasswordHandler(account);
        // update log with new password
        return;
    };

    // Called by Dialog if admin chooses to ignore the user's request
    const reject = async () => {
        await removeResetRequestHandler(account);
        return;
    };

    return (
        <>
            <ListBox 
                filter
                options={request}
                optionLabel="username"
                onChange={(e) => { setAccount(e.value); setPopupVisible(true);}}
            />

            <Dialog
                visible={errorDialogVisible}
                onHide={() => setDialogVisible(false)}
                closeIcon="pi pi-times"
                header="Error"
            >
            <p>Something went wrong. Please try again.</p>
            </Dialog>
            
            <Dialog
                visible={passwordDisplayVisible}
                onHide={() => {setPasswordDisplayVisible(false); setPassword(""); aGetRequests()}}
                header="Success!"
                closeIcon="pi pi-times"
            >
            <p>{account.username}'s password was successfully reset to {password}.</p>
            </Dialog>

            <Dialog
                visible={ignorePasswordDisplayVisible}
                onHide={() => {aGetRequests(); setIgnorePasswordDisplayVisible(false)}}
                header="Request ignored"
                closeIcon="pi pi-times"
            >
            <p>{account.username}'s password reset request was ignored.</p>
            </Dialog>

            <ConfirmPopup
                visible={resetPopupVisible}
                message={`Would you like to reset ${account.username}'s password, or to ignore the request?`}
                accept={accept} acceptLabel='Reset password'
                reject={reject} rejectLabel='Ignore'
            />
        </>
    )
}

export default ResetList;
