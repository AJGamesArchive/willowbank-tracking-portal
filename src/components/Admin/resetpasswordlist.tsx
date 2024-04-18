import './resetpasswordlist.css'
import '../../functions/Global/GetResetRequests.ts'
import { ListBox } from 'primereact/listbox';
import React from 'react';
import { PasswordRequest } from '../../types/Global/PasswordRequest.ts';
import { ConfirmPopup } from 'primereact/confirmpopup';
import './ResetPasswordPopup.css';
//import { generatePassword } from '../../functions/Login/GeneratePassword';
import { removeResetRequest } from '../../functions/Global/DBUpdatePasswordRequests';
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
    const [account, setAccount] = useState<PasswordRequest>({
        username: "test",
        accountType: "",
        created: ""
    });

    // Calls removeResetRequest, which tries to remove the given account
    // from the request array and update the database
    // Returns void
    async function removeResetRequestHandler( account : PasswordRequest ) {    
        const output = await removeResetRequest(account);
        if (!output) {
            setPopupVisible(true)
        }
        return;
    }

    // Called by Dialog if admin chooses to reset the user's password
    const accept = () => {
        // Change password
        return
    }

    // Called by Dialog if admin chooses to ignore the user's request
    const reject = () => {
        // calls removeResetRequest and sets popup visibility to true
        // if the account could not be removed
        removeResetRequestHandler(account);
        return;
    }

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
                header="Error"
            >
            <p>Something went wrong. Please try again.</p>
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