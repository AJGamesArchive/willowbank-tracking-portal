// Import core functions
import { useEffect, useState } from 'react';

// Import types
import { WindowSize } from '../../types/Global/WindowSize';

// Function to detect the window size of the device running the application and update these sizes if the screen is resized
export function detectWindowSize(): WindowSize {
  // Variable to store the screen resolution of the run time device
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  // Event handler to perform action upon initial render
  useEffect(() => {
    // Create event handler to update the saved screen resolution numbers when the screensize is updated
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    // Add the 'handleResize' event handler to the page event listeners
    window.addEventListener('resize', handleResize);
    // Cleanup function to remove the event handler when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // Return detected window size
  return windowSize;
};