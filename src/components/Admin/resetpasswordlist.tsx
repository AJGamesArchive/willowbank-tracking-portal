import './ResetPasswordList.css'
import '../../functions/Global/GetResetRequests.ts'
import { ListBox } from 'primereact/listbox';
import React from 'react';
import { PasswordRequest } from '../../types/Global/PasswordRequest.ts';
import ConfirmReset from './ResetPasswordPopup.tsx';

interface IResetList {
    requests : PasswordRequest[];
}

const ResetList : React.FC<IResetList> = ({requests}) => {
    var username: string[] = [];
    requests.forEach(element => {
        username.push(element.username);
    });
    return <ListBox 
        filter
        options={username}
        onChange={(e) => {
            return ConfirmReset(e.value);
        }}
    ></ListBox>
}

export default ResetList;