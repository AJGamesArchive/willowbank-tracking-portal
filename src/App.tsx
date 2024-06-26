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
import ViewBadgesDesktop from './pages/Student/ViewBadges/ViewAllBadgesDesktop';
import ViewBadgesMobile from './pages/Student/ViewBadges/ViewAllBadgesMobile';

// Admin Portal
import AdminPortalDesktop from './pages/Admin/Portal/AdminPortalDesktop';
import AdminPortalMobile from './pages/Admin/Portal/AdminPortalMobile';
import AdminResetDesktop from './pages/Admin/ResetPasswords/AdminResetDesktop';
import AdminResetMobile from './pages/Admin/ResetPasswords/AdminResetMobile';
import AdminAccountManageDesktop from './pages/Admin/Manage Accounts/AdminAccManageDesktop';
import ManageProgramsDesktop from './pages/Admin/Manage Programs/ManageProgramsDesktop';
import ManageProgramsMobile from './pages/Admin/Manage Programs/ManageProgramsMobile';
import ManageSchoolsDesktop from './pages/Admin/Manage Schools/ManageSchoolsDesktop';
import AdminCreateMenuDesktop from './pages/Admin/Create Accounts/AdminCreateMenuDesktop';
import AdminCreateMenuMobile from './pages/Admin/Create Accounts/AdminCreateMenuMobile';
import AdminCreateStudentDesktop from './pages/Admin/Create Accounts/AdminCreateStudentDesktop';
import AdminCreateStudentMobile from './pages/Admin/Create Accounts/AdminCreateStudentMobile';
import AdminCreateStaffDesktop from './pages/Admin/Create Accounts/AdminCreateStaffDesktop';
import AdminCreateStaffMobile from './pages/Admin/Create Accounts/AdminCreateStaffMobile';
import AwardRevokeXPDesktop from './pages/Admin/AwardXP/AwardRevokeXPDesktop';
import AwardRevokeXPMobile from './pages/Admin/AwardXP/AwardRevokeXPMobile';
import ViewTimetablesDesktop from './pages/Admin/View Timetables/ViewTimetablesDesktop';

// Teacher Portal
import TeacherPortalDesktop from './pages/Teacher/TeacherPortalDesktop';
import TeacherPortalMobile from './pages/Teacher/TeacherPortalMobile';

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
        <Route path="/studenthome/:snowflake/:token/:name" Component={StudentMobile}></Route>
        <Route path="/adminportal/:snowflake/:token/:name" Component={AdminPortalMobile} />
        <Route path="/adminportal/resetpassword/:snowflake/:token/:name" Component={AdminResetMobile}/>
        <Route path="/adminportal/manageprograms/:snowflake/:token/:name" Component={ManageProgramsMobile}/>
        <Route path="/teacherportal/:snowflake/:token/:name" Component={TeacherPortalMobile} />
        <Route path="/student/viewbadges/:snowflake/:token/:name/:mode/:filter" Component={ViewBadgesMobile}/>
        <Route path="/adminportal/createaccountmenu/:snowflake/:token/:name" Component={AdminCreateMenuMobile}/>
        <Route path="/adminportal/createastudent/:snowflake/:token/:name" Component={AdminCreateStudentMobile}/>
        <Route path="/adminportal/createastaff/:snowflake/:token/:name/:accountType" Component={AdminCreateStaffMobile}/>
        <Route path="/adminportal/manageprogress/:snowflake/:token/:name" Component={AwardRevokeXPMobile} />
        <Route path="/adminportal/viewtimetables/:snowflake/:token/:name" Component={ViewTimetablesDesktop}/>
      </Routes>
    );
  } else if (windowSize.width >= 768 && windowSize.width <= 1024) {
    // Returning tablet & 'medium' size device UI code
    //? Currently same as desktop unless we have time to create additional UI code for medium devices
    return (
      <Routes>
        <Route path="/" Component={LoginDesktop} />
        <Route path="/home" Component={LoginDesktop} />
        <Route path="/studenthome/:snowflake/:token/:name" Component={StudentDesktop}></Route>
        <Route path="/adminportal/:snowflake/:token/:name" Component={AdminPortalDesktop} />
        <Route path="/adminportal/resetpassword/:snowflake/:token/:name" Component={AdminResetDesktop}/>
        <Route path="/adminportal/manageprograms/:snowflake/:token/:name" Component={ManageProgramsDesktop}/>
        <Route path="/teacherportal/:snowflake/:token/:name" Component={TeacherPortalDesktop} />
        <Route path="/AccManagement/:snowflake/:token/:name" Component={AdminAccountManageDesktop} />
        <Route path="/student/viewbadges/:snowflake/:token/:name/:mode/:filter" Component={ViewBadgesDesktop}/>
        <Route path="/adminportal/createaccountmenu/:snowflake/:token/:name" Component={AdminCreateMenuDesktop}/>
        <Route path="/adminportal/createastudent/:snowflake/:token/:name" Component={AdminCreateStudentDesktop}/>
        <Route path="/adminportal/createastaff/:snowflake/:token/:name/:accountType" Component={AdminCreateStaffDesktop}/>
        <Route path="/adminportal/manageprogress/:snowflake/:token/:name" Component={AwardRevokeXPDesktop} />
        <Route path="/adminportal/viewtimetables/:snowflake/:token/:name" Component={ViewTimetablesDesktop}/>
      </Routes>
    );
  } else {
    // Returning desktop device UI code
    return (
      <Routes>
        <Route path="/" Component={LoginDesktop} />
        <Route path="/home" Component={LoginDesktop} />
        <Route path="/studenthome/:snowflake/:token/:name" Component={StudentDesktop}/>
        <Route path="/adminportal/:snowflake/:token/:name" Component={AdminPortalDesktop} />
        <Route path="/adminportal/resetpassword/:snowflake/:token/:name" Component={AdminResetDesktop}/>
        <Route path="/adminportal/manageprograms/:snowflake/:token/:name" Component={ManageProgramsDesktop}/>
        <Route path="/teacherportal/:snowflake/:token/:name" Component={TeacherPortalDesktop} />
        <Route path="/AccManagement/:snowflake/:token/:name" Component={AdminAccountManageDesktop} />
        <Route path="/adminportal/manageschools/:snowflake/:token/:name" Component={ManageSchoolsDesktop}/>
        <Route path="/adminportal/viewtimetables/:snowflake/:token/:name" Component={ViewTimetablesDesktop}/>
        <Route path="/student/viewbadges/:snowflake/:token/:name/:mode/:filter" Component={ViewBadgesDesktop}/>
        <Route path="/adminportal/createaccountmenu/:snowflake/:token/:name" Component={AdminCreateMenuDesktop}/>
        <Route path="/adminportal/createastudent/:snowflake/:token/:name" Component={AdminCreateStudentDesktop}/>
        <Route path="/adminportal/createastaff/:snowflake/:token/:name/:accountType" Component={AdminCreateStaffDesktop}/>
        <Route path="/adminportal/manageprogress/:snowflake/:token/:name" Component={AwardRevokeXPDesktop} />
      </Routes>
    );
  };
};

export default App;