// Import core functions
// --import { useState } from 'react';
import React, { useEffect, useState } from 'react';
import { retrieveDocumentIDs } from '../../functions/Global/RetrieveDocumentIDs';
import { ListBox } from 'primereact/listbox';

// Import CSS
import './AccountMang.css'

const AccountListBox: React.FC = () => {
    const [usernames, setUsernames] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentUsernames = await retrieveDocumentIDs('students');
                const teacherUsernames = await retrieveDocumentIDs('teachers');
                const adminUsernames = await retrieveDocumentIDs('admins');
                const allUsernames = [...studentUsernames, ...teacherUsernames, ...adminUsernames];
                setUsernames(allUsernames);
            } catch (error) {
                console.error('Error fetching usernames:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <ListBox
            filter
            options={usernames}
        />
    );
};



export default AccountListBox;
