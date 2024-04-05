// Import core functions
import { PrimeReactContext } from 'primereact/api';
import { useContext } from 'react';

// Setup the changeTheme function
export const { changeTheme } = useContext(PrimeReactContext);

// Example usage to change theme
//* changeTheme?.("/themes/lara-dark-teal/theme.css", "/themes/lara-light-teal/theme.css", "theme", (() => {}));
//* changeTheme(currentTheme: string, newTheme: string, linkElementId: string, callback: Function)