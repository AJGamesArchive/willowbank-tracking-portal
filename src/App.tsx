import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" Component={Login} />
      <Route path="/home" Component={Login} />
    </Routes>
  );
};

export default App;