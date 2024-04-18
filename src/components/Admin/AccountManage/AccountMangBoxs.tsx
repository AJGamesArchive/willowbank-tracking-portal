// Import core functions
// --import { useState } from 'react';
import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { getUserData } from '../../../functions/Admin/accountInformation';
import { UserData } from '../../../functions/Admin/accountInformation';


// Import CSS
import './AccountMangBoxs.css';

interface AccountListBoxProps {
    selectedUsername: string;
    setSelectedUsername: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
}
    //creates usestates for the selected users ifnromation
    const AccountManageBoxs: React.FC<AccountListBoxProps> = ({selectedUsername, setSelectedUsername,selectedCategory,setSelectedCategory}) => {
    const [userData, setUserData] = useState<UserData | null>(null);

    //use effects runs when component is called
    useEffect(() => {
        if (selectedUsername && selectedCategory) {
            getUserData(selectedUsername, selectedCategory)
                .then((data) => {
                    setUserData(data);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, []);

    return (

            <div>
                {selectedUsername !== "" && (

                    <div className="textBoxContainer">
                        <h3> {selectedUsername} Account </h3>

                        <label htmlFor="username:  ">Username</label>
                        <InputText 
                        id="username"
                        value={userData?.firstName}
                        />
                        <label htmlFor="First Name:  ">FirstName</label>
                        <InputText 
                        id="FirstName"
                        value={userData?.firstName}
                        />
                        <label htmlFor="Last Name Intl:  ">LastName</label>
                        <InputText 
                        id="LastName"
                        value={userData?.lastName}
                        />
                        <label htmlFor="School:  ">School</label>
                        <InputText 
                        id="School"
                        value={userData?.school}
                        />
                    </div>
                    



                )}
            </div>

            );









}

export default AccountManageBoxs;