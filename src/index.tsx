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
//TODO Update the activity IDing system to store what the next activity ID for a given program should be and then use and increment that ID each time an activity is created
//TODO Update program creation code to add the new programs to all students and setup the corresponding skeleton tracking data
//TODO Update program deletion code to delete the respective program from all students who have not made any progress in the program
//TODO Using an example from the program and activity management CSS, see if you can apply the card hover effect to only specific CSS classes.