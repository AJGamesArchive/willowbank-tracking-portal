import './resetpasswordlist.css';
import '../../functions/Global/GetResetRequests.ts'
import { ListBox } from 'primereact/listbox';
import React from 'react';

interface IResetList {
    requests : string[];
}

const ResetList : React.FC<IResetList> = ({requests}) => {
    return <ListBox 
        // onChange={TO BE IMPLEMENTED}
        options={requests}
        />
}

export default ResetList;