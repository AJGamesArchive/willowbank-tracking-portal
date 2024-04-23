import './ResetPasswordList.css'
import React from 'react';
import { ListBox } from 'primereact/listbox';
import { PasswordRequest } from '../../types/Global/PasswordRequest.ts';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { removeResetRequest, resetPassword } from '../../functions/Global/DBUpdatePasswordRequests.ts';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';

interface IResetList {
    requests : PasswordRequest[];
}

const ResetList : React.FC<IResetList> = ({requests}) => {
    var username: string[] = [];
    requests.forEach(element => {
        username.push(element.username);
    });

    // Use state constant declarations
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [passwordDisplayVisible, setPasswordDisplayVisible] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("")
    const [account, setAccount] = useState<PasswordRequest>({
        snowflake: "",
        username: "test",
        accountType: "",
        created: ""
    });

    // Calls removeResetRequest, which tries to remove the given account
    // from the request array and update the database
    // Returns void
    async function removeResetRequestHandler( account : PasswordRequest ) {    
        const output = await removeResetRequest(account, true, "");
        if (!output) {
            setPopupVisible(true)
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
                options={requests}
                optionLabel="username"
                onChange={(e) => { setAccount(e.value); setPopupVisible(true);}}
            />

            <Dialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                closeIcon="pi pi-times"
                header="Error"
            >
            <p>Something went wrong. Please try again.</p>
            </Dialog>
            {

            }
            <Dialog
                visible={passwordDisplayVisible}
                onHide={() => {setPasswordDisplayVisible(false); setPassword("")}}
                header="Success!"
                closeIcon="pi pi-times"
            >
            <p>{account.username}'s password was successfully reset to {password}.</p>
            </Dialog>

            <ConfirmPopup
                visible={popupVisible}
                message={`Would you like to reset ${account.username}'s password?`}
                accept={accept}
                reject={reject}
            />
        </>
    )
}

export default ResetList;
