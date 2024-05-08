import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { confirmLogin } from "../../../functions/Global/ConfirmLogin";
import { GlobalParams } from "../../../interfaces/GlobalParams";
import { AdminAccountCreation } from "../../../interfaces/AdminAccountCreation";
import StaffCreationForm from "../../../components/Login/StaffCreateAccount";
import { ProgressSpinner } from "primereact/progressspinner";
import { ConfirmDialog } from "primereact/confirmdialog";

const AdminCreateStaffDesktop: React.FC = () => {
    // Setting up global params on this page
    const params = useParams<GlobalParams>();
    const accountTypeParams = useParams<AdminAccountCreation>();
  
    // Variable to force confirmation of the account login state
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
    // Event handler to perform action upon initial render
    useEffect(() => {
      async function confirmLoginHandler() {
        const confirmed: boolean = await confirmLogin("admins", params.snowflake, params.token);
        if (!confirmed) { window.location.href = `/home`; return;}
        setIsLoggedIn(true); 
        return;
      };
      confirmLoginHandler();
      
    }, []); // Emptying process array to ensure handler only runs on initial render
  
  
    if (isLoggedIn)
    {
        return ( 
            <>
                <ConfirmDialog/>
                <StaffCreationForm accountType={(accountTypeParams.accountType) ? accountTypeParams.accountType : ''}/>
            </>
        )
    } else {
        return (
          <>
            <ProgressSpinner/>
          </>
        );
      };
}
export default AdminCreateStaffDesktop;