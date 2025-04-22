import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Reset: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear stored credentials
    localStorage.removeItem('tenderlyUsername');
    localStorage.removeItem('tenderlyProject');
    
    // Redirect back to home after a short delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1>Credentials Reset</h1>
      <p>Your Tenderly credentials have been cleared. Redirecting you back to the home page...</p>
    </div>
  );
};

export default Reset; 