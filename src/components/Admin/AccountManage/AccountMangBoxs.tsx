// Import core functions
// --import { useState } from 'react';
import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';

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
    const [selectedFirstName, setselectedFirstName] = useState<string | null>(null);
    const [selectedLastName, setselectedLastName] = useState<string | null>(null);
    const [selectedschool, setselectedschool] = useState<string | null>(null);

    //use effects runs when component is called
    useEffect(() => {
        const fetchData = async () => {
            try {
                
            } catch (error) {
                //runs error if a problem arrises with fetching usernames
                console.error('Error fetching infromation:', error);
            }
        };

        fetchData();
    }, []);

    return (

            <div>
                {selectedUsername !== "" && (

                    <div className="textBoxContainer">
                        <h3> {selectedUsername} Account </h3>

                        <label htmlFor="username:  ">Username</label>
                        <InputText 
                        id="username"
                        value={selectedUsername}
                        />
                        <label htmlFor="First Name:  ">FirstName</label>
                        <InputText 
                        id="FirstName"
                        
                        />
                        <label htmlFor="Last Name Intl:  ">LastName</label>
                        <InputText id="LastName"
                        />
                        <label htmlFor="School:  ">School</label>
                        <InputText id="School"
                        />
                    </div>
                    



                )}
            </div>

            );









}

export default AccountManageBoxs;