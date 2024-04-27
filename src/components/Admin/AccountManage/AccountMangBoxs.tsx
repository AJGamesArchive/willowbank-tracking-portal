// Import core functions
// --import { useState } from 'react';
import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { getUserData } from '../../../functions/Admin/accountInformation';
import { UserData } from '../../../functions/Admin/accountInformation';

// Import types
import { CoreStaffAccountDetails } from '../../../types/Global/UserAccountDetails';
import { CoreStudentAccountDetails } from '../../../types/Global/UserAccountDetails';

// Import CSS
import './AccountMangBoxs.css';

interface AccountListBoxProps {
    selectedUsername: CoreStudentAccountDetails | CoreStaffAccountDetails;
    setSelectedUsername: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
}
    //creates usestates for the selected users ifnromation
    const AccountManageBoxs: React.FC<AccountListBoxProps> = ({selectedUsername, setSelectedUsername,selectedCategory,setSelectedCategory}) => {
    const [userData, setUserData] = useState<UserData>();

    //use effects runs when component is called
    useEffect(() => {
        if (selectedUsername && selectedCategory) {
            getUserData(selectedUsername.snowflake, selectedCategory)
                .then((data) => {
                    if(typeof data !== "string") {
                        setUserData(data);
                        console.log(userData);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
            } else {
                // Clear userData when selectedUsername is null
                setUserData(null as unknown as UserData | undefined);
            }
    },[selectedUsername, selectedCategory]);

    return (
        <div>
            {userData ? (
                <div className="textBoxContainer">
                    <h3> {userData.username} Account </h3>
                    <label htmlFor="username:  ">Username</label>
                    <InputText 
                    id="username"
                    value={userData?.username}
                    />
                    <label htmlFor="First Name:  ">FirstName</label>
                    <InputText 
                    id="FirstName"
                    value={userData?.firstName}
                    />
                    <label htmlFor="Last Name Intl:  ">LastName</label>
                    <InputText 
                    id="LastName"
                    value={userData?.surnameInitial}
                    />
                    <label htmlFor="School:  ">School</label>
                    <InputText 
                    id="School"
                    value={userData?.school}
                    />
                </div>
            ): null}
        </div>
    );
};

export default AccountManageBoxs;