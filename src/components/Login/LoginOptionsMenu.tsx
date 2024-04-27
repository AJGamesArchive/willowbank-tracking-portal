// Import CSS
import './LoginOptionsMenu.css';
import '../../pages/Login/LoginGlobal.css'

// Import functions
import { generateToken } from '../../functions/Global/GenerateToken';

// Import UI components
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

// Importing snowflakes
import { snowflake } from '../../classes/Snowflake'; //! Remove later

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
    <div style={{ display: visible ? 'block' : 'none' }}>
      <h1>Welcome!</h1>
      <p className='login-subheader'>
        Please login or create a new account.
      </p>
      <PanelMenu model={options}/>
      <div className='login-footer'>
        <p>
          <i className='pi pi-book'/> Willowbank Education Track Portal
        </p>
      </div>
      <Divider/>
      <Button label={`[DEV] Token & Snowflake`} icon="pi pi-exclamation-triangle" onClick={() => {
        console.log(generateToken()); //! Remove later
        console.log(snowflake.generate()); //! Remove later
      }} raised severity="help"/>
    </div>
  );
};

export default LoginOptionsMenu;
