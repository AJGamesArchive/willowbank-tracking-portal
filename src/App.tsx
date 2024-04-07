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
import StudentDesktop from './pages/Student/HomeDesktop';
import StudentMobile from './pages/Student/HomeMobile';

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
        <Route path="/studenthome" Component={StudentMobile}></Route>
      </Routes>
    );
  } else if (windowSize.width >= 768 && windowSize.width <= 1024) {
    // Returning tablet & 'medium' size device UI code
    //? Currently same as desktop unless we have time to create additional UI code for medium devices
    return (
      <Routes>
        <Route path="/" Component={LoginDesktop} />
        <Route path="/home" Component={LoginDesktop} />
        <Route path="/studenthome" Component={StudentDesktop}></Route>
      </Routes>
    );
  } else {
    // Returning desktop device UI code
    return (
      <Routes>
        <Route path="/" Component={LoginDesktop} />
        <Route path="/home" Component={LoginDesktop} />
        <Route path="/studenthome" Component={StudentDesktop}></Route>
      </Routes>
    );
  };
};

export default App;