import './NavCreateAccount.css'
import React from 'react';
import { Button } from "primereact/button";

// Declare parameter types for button
interface ICreate {
    AccountType : string;
}

const CreateAccountButton : React.FC<ICreate> = ({AccountType}) =>
{
    // Set destinationPage
    if (AccountType === "student") { var destinationPage : string = "" } // student
    else { var destinationPage : string = "" } // teacher

    return <Button className="CreateAccountButton"
        label={"Create new " + AccountType}
        onClick={() => window.location.href = destinationPage }
    />
}

export default CreateAccountButton;