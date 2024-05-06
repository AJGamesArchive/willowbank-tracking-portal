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
import AccountManageBoxs from './AccountMangBoxs';

interface AccountListBoxProps {
    reload : boolean
    setReload : (value : boolean) => void;
}

const AccountListBox: React.FC<AccountListBoxProps> = ({reload, setReload}) => {
    //declaring state variables, ready to store teachers, students and admins and selected user
    const [students, setStudents] = useState<CoreStudentAccountDetails[]>([]);
    const [teachers, setTeachers] = useState<CoreStaffAccountDetails[]>([]);
    const [admins, setAdmins] = useState<CoreStaffAccountDetails[]>([]);
    const [selectedUser, setSelectedUser] = useState<CoreStudentAccountDetails | CoreStaffAccountDetails>({
        snowflake: '',
        username: '',
        firstName: '',
        surnameInitial: '',
        password: '',
        school: '',
        token: '',
        badges: []
    }); 
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    // Function to handle username selection
    const handleUsernameSelect = (e: any) => {
        setSelectedUser(e.value); 
        // Determine the category based on the selected username
        const isStudent = students.some(student => student.username === selectedUser.username);
        const isTeacher = teachers.some(teacher => teacher.username === selectedUser.username);
        const isAdmin = admins.some(admin => admin.username === selectedUser.username);

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
                    //TODO Return some error here
                    return;
                };

                setStudents(studentData);
                setTeachers(teacherData);
                setAdmins(adminData);

            } catch (error) {
                //runs error if a problem arises with fetching usernames
                console.error('Error fetching usernames:', error);
            }
        };

        if (reload) {
            fetchData();
            setReload(false);
        }

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
                <AccountManageBoxs
                    selectedUser={selectedUser}
                    selectedCategory={selectedCategory}
                    callback={setReload}
                />
        </div>
    );
};

export default AccountListBox;
