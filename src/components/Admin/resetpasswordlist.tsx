import './resetpasswordlist.css';
import '../../functions/Global/GetResetRequests.ts'
import { ListBox } from 'primereact/listbox';
import React from 'react';
import { PasswordRequest } from '../../types/Global/PasswordRequest.ts';

interface IResetList {
    requests : PasswordRequest[];
}

const ResetList : React.FC<IResetList> = ({requests}) => {
    return <ListBox 
        // onChange={TO BE IMPLEMENTED}
        options={requests}
        />
}

export default ResetList;