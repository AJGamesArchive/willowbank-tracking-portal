// Import core functions
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import CSS
import './App.css';

// Import types
import { WindowSize } from './types/Global/WindowSize';

// Import functions
import { detectWindowSize } from './functions/Global/DetectWindowSize';

// Import pages
import LoginDesktop from './pages/Login/LoginDesktop';
import LoginMobile from './pages/Login/LoginMobile';

// Student Portal
import StudentDesktop from './pages/Student/HomeDesktop';
import StudentMobile from './pages/Student/HomeMobile';

// Admin Portal
import AdminPortalDesktop from './pages/Admin/Portal/AdminPortalDesktop';
import AdminPortalMobile from './pages/Admin/Portal/AdminPortalMobile';
import AdminResetDesktop from './pages/Admin/Reset password/AdminResetDesktop';
import AdminResetMobile from './pages/Admin/Reset password/AdminResetMobile';
import ManageProgramsDesktop from './pages/Admin/Manage Programs/ManageProgramsDesktop';
import ManageProgramsMobile from './pages/Admin/Manage Programs/ManageProgramsMobile';

// Teacher Portal
import TeacherPortalDesktop from './pages/Teacher/TeacherPortalDesktop';
import TeacherPortalMobile from './pages/Teacher/TeacherPortalMobile';
import AdminAccMangDesktop from './pages/Admin/Manage Accounts/AdminAccMangDesktop';
import AdminAccMangMobile from './pages/Admin/Manage Accounts/AdminAccMangMobile';

// React function to handle core app navigation and UI code rendering based on given run time device screen size
const App: React.FC = () => {
  // Variable to store screen size values for the current run time device
  const windowSize: WindowSize = detectWindowSize();
  // Defining breakpoints for screen size/device differences and using the breakpoints to return different UI code
  if (windowSize.width < 768) {
    // Returning mobile device UI code
    return (
      <Routes>
        <Route path="/" Component={LoginMobile} />
        <Route path="/home" Component={LoginMobile} />
        <Route path="/studenthome/:username/:token" Component={StudentMobile}></Route>
        <Route path="/adminportal/:username/:token" Component={AdminPortalMobile} />
        <Route path="/adminportal/resetpassword/:username/:token" Component={AdminResetMobile}/>
        <Route path="/adminportal/manageprograms/:username/:token" Component={ManageProgramsMobile}/>
        <Route path="/teacherportal/:username/:token" Component={TeacherPortalMobile} />
        <Route path="/AccManagement/:username/:token" Component={AdminAccMangMobile} />
      </Routes>
    );
  } else if (windowSize.width >= 768 && windowSize.width <= 1024) {
    // Returning tablet & 'medium' size device UI code
    //? Currently same as desktop unless we have time to create additional UI code for medium devices
    return (
      <Routes>
        <Route path="/" Component={LoginDesktop} />
        <Route path="/home" Component={LoginDesktop} />
        <Route path="/studenthome/:username/:token" Component={StudentDesktop}></Route>
        <Route path="/adminportal/:username/:token" Component={AdminPortalDesktop} />
        <Route path="/adminportal/resetpassword/:username/:token" Component={AdminResetDesktop}/>
        <Route path="/adminportal/manageprograms/:username/:token" Component={ManageProgramsDesktop}/>
        <Route path="/teacherportal/:username/:token" Component={TeacherPortalDesktop} />
        <Route path="/AccManagement/:username/:token" Component={AdminAccMangDesktop} />
      </Routes>
    );
  } else {
    // Returning desktop device UI code
    return (
      <Routes>
        <Route path="/" Component={LoginDesktop} />
        <Route path="/home" Component={LoginDesktop} />
        <Route path="/studenthome/:username/:token" Component={StudentDesktop}></Route>
        <Route path="/adminportal/:username/:token" Component={AdminPortalDesktop} />
        <Route path="/adminportal/resetpassword/:username/:token" Component={AdminResetDesktop}/>
        <Route path="/adminportal/manageprograms/:username/:token" Component={ManageProgramsDesktop}/>
        <Route path="/teacherportal/:username/:token" Component={TeacherPortalDesktop} />
        <Route path="/AccManagement/:username/:token" Component={AdminAccMangDesktop} />
      </Routes>
    );
  };
};

export default App;