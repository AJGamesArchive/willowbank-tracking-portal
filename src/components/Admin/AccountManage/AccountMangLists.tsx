// Import core functions
import React, { useState } from 'react';
import { ListBox } from 'primereact/listbox';

// Import types
import { CoreStaffAccountDetails } from '../../../types/Global/UserAccountDetails';
import { CoreStudentAccountDetails } from '../../../types/Global/UserAccountDetails';

// Import CSS
import './AccountMangLists.css';

// Import UI components
import AccountManageBoxs from './AccountMangBoxs';

interface AccountListBoxProps {
  setReload : (value : boolean) => void;
  allStudents: CoreStudentAccountDetails[];
  allTeachers: CoreStaffAccountDetails[];
  allAdmins: CoreStaffAccountDetails[];
};

const AccountListBox: React.FC<AccountListBoxProps> = ({setReload, allStudents, allTeachers, allAdmins}) => {
  // State variables to store selected users
  const [selectedUserStudent, setSelectedUserStudent] = useState<CoreStudentAccountDetails>({
      snowflake: '',
      username: '',
      firstName: '',
      surnameInitial: '',
      password: '',
      school: '',
      token: '',
      badges: []
  });
  const [selectedUserStaff, setSelectedUserStaff] = useState<CoreStaffAccountDetails>({
    snowflake: '',
    username: '',
    firstName: '',
    surname: '',
    password: '',
    schools: [],
    token: '',
  });

  // State variable to store the selected user type
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // State variable to control the visibility of the edit details dialogue box
  const [visibleDialogue, setVisibleDialogue] = useState<boolean>(false);

  // Function to handle username selection
  const handleUsernameSelect = (e: any, accountType: string) => {
    setSelectedCategory(accountType);
    switch(accountType) {
      case "students":
        setSelectedUserStudent(e.value);
        break;
      default:
        setSelectedUserStaff(e.value);
        break;
    };
    setVisibleDialogue(true);
    return;
  };

  // Returning core JSX
  return (
    <div>
      <>
        <div className="listBoxContainer">
          <h3>Student Usernames</h3>
          <ListBox
            filter
            options={allStudents}
            optionLabel='username'
            onChange={(e: any) => handleUsernameSelect(e, "students")}
          />
        </div>

        <div className="listBoxContainer">
          <h3>Teacher Usernames</h3>
          <ListBox
            filter
            options={allTeachers}
            optionLabel='username'
            onChange={(e: any) => handleUsernameSelect(e, "teachers")}
          />
        </div>

        <div className="listBoxContainer">
          <h3>Admin Usernames</h3>
          <ListBox
            filter
            options={allAdmins}
            optionLabel='username'
            onChange={(e: any) => handleUsernameSelect(e, "admins")}
          />
        </div>
      </>

      <AccountManageBoxs
        visible={visibleDialogue}
        setVisible={setVisibleDialogue}
        selectedUserStudent={selectedUserStudent}
        selectedUserStaff={selectedUserStaff}
        selectedCategory={selectedCategory}
        callback={setReload}
      />
    </div>
  );
};

export default AccountListBox;
