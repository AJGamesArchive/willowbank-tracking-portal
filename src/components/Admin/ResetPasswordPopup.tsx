import { ConfirmPopup } from 'primereact/confirmpopup';
import './ResetPasswordPopup.css';
import { PasswordRequest } from '../../types/Global/PasswordRequest';
//import { generatePassword } from '../../functions/Login/GeneratePassword';
import { removeResetRequest } from '../../functions/Global/DBUpdatePasswordRequests';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import React from 'react';

interface IConfirmReset {
    account: PasswordRequest;
};

const ConfirmReset: React.FC<IConfirmReset> = ( {account} ) => {
    const [visible, setVisible] = useState(false);
     async function removeResetRequestHandler( account : PasswordRequest ) : Promise<void> {    
         const output = await removeResetRequest(account);
         if (!output)
        {
            setVisible(true);
        }
        return;
    }


    const accept = () => {
        // Change password
        return
    }

    const reject = () => {
        removeResetRequestHandler(account);
        return;
    }

    return (
        <>
            <Dialog
                visible={visible}
                onHide={() => setVisible(false)}
                header="Error"
            >
            <p>Something went wrong. Please try again.</p>
            </Dialog>
            <ConfirmPopup
            message={`Would you like to reset ${account.username}'s password?`}
            accept={accept}
            reject={reject}
            />
        </>
    )
}

export default ConfirmReset;