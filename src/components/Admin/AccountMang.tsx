// Import core functions
// --import { useState } from 'react';

import React, { useEffect, useState } from 'react';
import { retrieveDocumentIDs } from '../../functions/Global/RetrieveDocumentIDs';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';

// Import CSS
import './AccountMang.css';

const AccountListBox: React.FC = () => {
    //declaring state variables, ready to store the usernames for teachers, students and admins and selected user
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null); 
    const [studentUsernames, setStudentUsernames] = useState<string[]>([]);
    const [teacherUsernames, setTeacherUsernames] = useState<string[]>([]);
    const [adminUsernames, setAdminUsernames] = useState<string[]>([]);

    // Function to handle username selection
    const handleUsernameSelect = (e: any) => {
        setSelectedUsername(e.value); // Update selected username
    };
    //use effects runs when component is called
    useEffect(() => {
        const fetchData = async () => {
            try {

                //fetches the usernames for Students, teachers and admins
                const studentUsernamesResponse = await retrieveDocumentIDs('students');
                const teacherUsernamesResponse = await retrieveDocumentIDs('teachers');
                const adminUsernamesResponse = await retrieveDocumentIDs('admins');

                //converts responeses into arrays if they are not already one to negate data type error
                const studentUsernamesArray = Array.isArray(studentUsernamesResponse) ? studentUsernamesResponse : [studentUsernamesResponse];
                const teacherUsernamesArray = Array.isArray(teacherUsernamesResponse) ? teacherUsernamesResponse : [teacherUsernamesResponse];
                const adminUsernamesArray = Array.isArray(adminUsernamesResponse) ? adminUsernamesResponse : [adminUsernamesResponse];

                //updates the state variables
                setStudentUsernames(studentUsernamesArray);
                setTeacherUsernames(teacherUsernamesArray);
                setAdminUsernames(adminUsernamesArray);
            } catch (error) {
                //runs error if a problem arrises with fetching usernames
                console.error('Error fetching usernames:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div> {/* Wrap everything in a div */}
        {selectedUsername === null && (
            <>
                <div className="listBoxContainer">
                    <h3>Student Usernames</h3>
                    <ListBox
                        filter
                        options={studentUsernames}
                        onChange={handleUsernameSelect}
                    />
                </div>

                <div className="listBoxContainer">
                    <h3>Teacher Usernames</h3>
                    <ListBox
                        filter
                        options={teacherUsernames}
                        onChange={handleUsernameSelect}
                    />
                </div>

                <div className="listBoxContainer">
                    <h3>Admin Usernames</h3>
                    <ListBox
                        filter
                        options={adminUsernames}
                        onChange={handleUsernameSelect}
                    />
                </div>
            </>
        )}
        <div className='buttonContainer'>
            <Button label="Back" icon="pi pi-arrow-left" onClick={() => {
            setSelectedUsername(null); //goes back to the list pages
            }} severity="secondary"/>
        </div>
    </div>
);
};

export default AccountListBox;
