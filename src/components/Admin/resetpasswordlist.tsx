import './resetpasswordlist.css';
import '../../functions/Global/GetResetRequests.ts'
import { ListBox } from 'primereact/listbox';
import React from 'react';
import { PasswordRequest } from '../../types/Global/PasswordRequest.ts';




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
        /*optionLabel={username}*/
    ></ListBox>
}

export default ResetList;