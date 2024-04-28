import './AdminMenuOption.css'
import React from "react";
import { Card } from 'primereact/card'

const SignOutOption : React.FC = () => {
    return <Card className="signOutMenuOption"
        header={ <img 
                    className="image" 
                    alt="Sign out button" 
                    src={`/assets/admin-portal-images/Sign-out.png`}/> 
                }
        title={"Sign out"}
        onClick={() => {window.location.href = `/home`}}
    />
}

export default SignOutOption;