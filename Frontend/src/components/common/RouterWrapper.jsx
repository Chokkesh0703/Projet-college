// RouteWrapper.js
import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

const RouteWrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the loading time as needed (e.g., 2000ms = 2 seconds)

    return () => clearTimeout(timer);
  }, []);

  // Loading component with gradient
  function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
      </React.Fragment>
    );
  }

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <GradientCircularProgress />
    </div>
  ) : (
    children
  );
};

export  default RouteWrapper;
