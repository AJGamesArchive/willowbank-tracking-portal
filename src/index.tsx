import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

//TODO -------- Alex Fix Your Shit! --------
//TODO Update all user accounts (students, teachers, admins) in the database to use tokens as document names
//TODO While updating student database details, setup the XP tracking data for all existing students and update the student account creation system to create this tracking data upon account creation.
//TODO Update program creation code to add the new programs to all students and setup the corresponding skeleton tracking data
//TODO Update all user account database connection code to use tokens as user document names
//TODO Ensure all code is updated to work with these data changes
//TODO Ensure all account username and program name unique validation code is updated to ensure these still need to be unique even though there not used as unique identifiers anymore
