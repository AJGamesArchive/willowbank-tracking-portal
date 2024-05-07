// Import CSS
import './LoginOptionsMenu.css';
import '../../pages/Login/LoginGlobal.css'

// Import UI components
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';

import { build } from '../../data/BuildNumber';

// Interfacing forcing certain props on the Login Options Menu component
interface LoginOptionsMenuProps {
  setLoginType: (value: string) => void;
  visible: boolean
  setVisible: (value: boolean) => void;
  setLoginFormView: (value: boolean) => void;
  setCreationFormView: (value: boolean) => void;
};

// React function to render the login page login options menu
const LoginOptionsMenu: React.FC<LoginOptionsMenuProps> = ({setLoginType, visible, setVisible, setLoginFormView, setCreationFormView}) => {
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
            setVisible(false);
            setLoginType("Student");
            setLoginFormView(true);
          },
        },
        {
          label: "Teacher",
          icon: "pi pi-user",
          command: () => {
            setVisible(false);
            setLoginType("Teacher");
            setLoginFormView(true);
          },
        },
        {
          label: "Admin",
          icon: "pi pi-chart-bar",
          command: () => {
            setVisible(false);
            setLoginType("Admin");
            setLoginFormView(true);
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
            setVisible(false);
            setLoginType("Student");
            setCreationFormView(true);
          },
        },
      ]
    },
  ];
  
  // Return JSX
  return (
    <div 
      style={{ backgroundColor: "#5A8D6E", 
        padding: "3%", 
        borderRadius: "5px", 
        margin: "auto", 
        minWidth: "50%",
        maxWidth: "750px",
        height: "fit-content", 
        verticalAlign: "middle",
        display: visible ? 'flex' : 'none' }}>
      <div className="left-div">
      <img src="https://images.squarespace-cdn.com/content/v1/602e622e8efecc669cef2b45/9e0ef273-0d6a-4792-9e90-526fcfa4a936/Screenshot%2B2022-11-22%2Bat%2B20.43.18.jpeg" 
        className='logo'/>
      </div>
      <div className="right-div">
      <h1 style={{textAlign: "left", margin: "0px"}}>Welcome!</h1>
      <h4 style = {{textAlign: "left"}}>Please login or create a new account.</h4>
      <PanelMenu model={options} />
      </div>
      <div className='login-footer'>
        <p>
          <i className='pi pi-book'/> Willowbank Education Tracking Portal - Build {build}
        </p>
      </div>
    </div>
  );
};

export default LoginOptionsMenu;
