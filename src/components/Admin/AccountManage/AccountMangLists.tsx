// Import core functions
import React, { useEffect, useState } from 'react';
import { ListBox } from 'primereact/listbox';
import { getStudentAccountInfo } from '../../../functions/Admin/getstudentAccountInfo';
import { getstaffAccountInfo } from '../../../functions/Admin/getstaffAccountInfo';

// Import types
import { CoreStaffAccountDetails } from '../../../types/Global/UserAccountDetails';
import { CoreStudentAccountDetails } from '../../../types/Global/UserAccountDetails';

// Import CSS
import './AccountMangLists.css';

interface AccountListBoxProps {
    selectedUsername: CoreStudentAccountDetails | CoreStaffAccountDetails;
    setSelectedUsername: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    reload : boolean
    setReload : (value : boolean) => void;
}

    const AccountListBox: React.FC<AccountListBoxProps> = ({selectedUsername, setSelectedUsername,selectedCategory,setSelectedCategory, reload, setReload}) => {
    //declaring state variables, ready to store teachers, students and admins and selected user
    const [students, setStudents] = useState<CoreStudentAccountDetails[]>([]);
    const [teachers, setTeachers] = useState<CoreStaffAccountDetails[]>([]);
    const [admins, setAdmins] = useState<CoreStaffAccountDetails[]>([]);

    // Function to handle username selection
    const handleUsernameSelect = (e: any) => {
        const selectedUsername = e.value;
        setSelectedUsername(selectedUsername); 
        // Determine the category based on the selected username
        const isStudent = students.some(student => student.username === selectedUsername.username);
        const isTeacher = teachers.some(teacher => teacher.username === selectedUsername.username);
        const isAdmin = admins.some(admin => admin.username === selectedUsername.username);

        if (isStudent) {
            setSelectedCategory('students');
        } else if (isTeacher) {
            setSelectedCategory('teachers');
        } else if (isAdmin) {
            setSelectedCategory('admins');
        } else {
            setSelectedCategory(""); // If the category is unknown or not found
        }
    };
    //use effects runs when component is called
    useEffect(() => {
        const fetchData = async () => { 
            try {
                //sets arrays to store student , teacher and admin data
                const studentData: CoreStudentAccountDetails[] | string = await getStudentAccountInfo()
                const teacherData: CoreStaffAccountDetails[] | string = await getstaffAccountInfo("T")
                const adminData:  CoreStaffAccountDetails[]  | string = await getstaffAccountInfo("A")

                if(typeof studentData === "string" || typeof teacherData === "string" || typeof adminData === "string") {
                    // Return some error here
                    return;
                };

                setStudents(studentData);
                setTeachers(teacherData);
                setAdmins(adminData);

            } catch (error) {
                //runs error if a problem arises with fetching usernames
                console.error('Error fetching usernames:', error);
            }

            if (reload) {
                await fetchData();
                setReload(false);
            }
        };

    }, [reload]);

    
    return (
        
        <div> {/* Wrap everything in a div */}
            <>
                <div className="listBoxContainer">
                    <h3>Student Usernames</h3>
                    <ListBox
                        filter
                        options={students}
                        optionLabel='username'
                        onChange={handleUsernameSelect}
                    />
                </div>

                <div className="listBoxContainer">
                    <h3>Teacher Usernames</h3>
                    <ListBox
                        filter
                        options={teachers}
                        optionLabel='username'
                        onChange={handleUsernameSelect}
                    />
                </div>

                <div className="listBoxContainer">
                    <h3>Admin Usernames</h3>
                    <ListBox
                        filter
                        options={admins}
                        optionLabel='username'
                        onChange={handleUsernameSelect}
                    />
                </div>
            </>
    </div>
);
};

export default AccountListBox;
