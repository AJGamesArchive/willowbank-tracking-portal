import './NavCreateAccount.css'
import React from 'react';
import { Button } from "primereact/button";

// Declare parameter types for button
interface ICreate {
    AccountType : string;
    Snowflake : string;
    Token : string;
    Name : string;
}

const CreateAccountButton : React.FC<ICreate> = ({AccountType, Snowflake, Token, Name}) =>
{
    // Set destinationPage
    if (AccountType === "student") { var destinationPage : string = `/AddStudent/${Snowflake}/${Token}/${Name}` } // student
    else { var destinationPage : string = "" } // teacher

    return <Button className="CreateAccountButton"
        label={"Create new " + AccountType}
        onClick={() => window.location.href = destinationPage }
    />
}

export default CreateAccountButton;