import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Function to countdown to our assignment deadline in the console
function printCountdown() {
  const targetDate = new Date("2024-05-07T14:00:00");
  const currentDate = new Date();
  
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  
  if (timeDifference <= 0) {
      console.log("Countdown finished!");
      clearInterval(interval);
      return;
  }
  
  const minutes = Math.floor(timeDifference / (1000 * 60));
  var hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  hours += (days * 24) - 24;

  if(hours < 5) {
    console.error(`${hours} hours, ${minutes % 60} minutes remaining until deadline`);
  } else if(minutes % 60 === 0) {
    console.error(`${hours} hours, ${minutes % 60} minutes remaining until deadline`);
  } else {
    console.warn(`${hours} hours, ${minutes % 60} minutes remaining until deadline`);
  };
};
const interval = setInterval(printCountdown, 60000);
printCountdown();

// Initialize the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
