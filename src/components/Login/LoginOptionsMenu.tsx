// Import CSS
import './LoginOptionsMenu.css';

// Import UI components
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';

// React function to render the login page login options menu
const LoginOptionsMenu: React.FC = () => {
  // Const to define the login options menu options
  const options: MenuItem[] = [
    {
      label: "Login",
      icon: "pi pi-sign-in",
      items: [
        {
          label: "Student",
          icon: "pi pi-users",
          command: () => {
            console.log("Login > Student"); //! Remove later
          },
        },
        {
          label: "Teacher",
          icon: "pi pi-user",
          command: () => {
            console.log("Login > Teacher"); //! Remove later
          },
        },
        {
          label: "Admin",
          icon: "pi pi-chart-bar",
          command: () => {
            console.log("Login > Admin"); //! Remove later
          },
        },
      ]
    },
    {
      label: "Create New Account",
      icon: "pi pi-plus",
      items: [
        {
          label: "Student",
          icon: "pi pi-users",
          command: () => {
            console.log("Create Account > Student"); //! Remove later
          },
        },
      ]
    },
  ];
  
  // Return JSX
  return (
    <PanelMenu model={options}/>
  );
};

export default LoginOptionsMenu;
