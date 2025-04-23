import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const RedirectForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [projectSlug, setProjectSlug] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Set document title
    document.title = 'Redirecting to Tenderly...';

    // Load saved values from localStorage
    const storedUsername = localStorage.getItem('tenderlyUsername');
    const storedProjectSlug = localStorage.getItem('tenderlyProjectSlug');
    
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedProjectSlug) {
      setProjectSlug(storedProjectSlug);
    }
    
    // Check if we're on the reset path
    const path = searchParams.get('path');
    if (path === '/reset') {
      // Clear credentials and redirect to root without parameters
      localStorage.removeItem('tenderlyUsername');
      localStorage.removeItem('tenderlyProjectSlug');
      navigate('/tdly-redirect');
      return;
    }
    
    // Only redirect if we have both stored values AND search parameters
    if (storedUsername && storedProjectSlug && searchParams.toString()) {
      console.log('Found stored values and parameters:', { storedUsername, storedProjectSlug, params: searchParams.toString() });
      const tenderlyUrl = `https://dashboard.tenderly.co/${storedUsername}/${storedProjectSlug}/simulator/new?${searchParams.toString()}`;
      console.log('Redirecting to:', tenderlyUrl);
      window.location.href = tenderlyUrl;
    }
  }, [searchParams, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !projectSlug) {
      return; // Don't proceed if fields are empty
    }
    
    // Store values in localStorage
    localStorage.setItem('tenderlyUsername', username);
    localStorage.setItem('tenderlyProjectSlug', projectSlug);
    
    // Only redirect if we have parameters
    if (searchParams.toString()) {
      const tenderlyUrl = `https://dashboard.tenderly.co/${username}/${projectSlug}/simulator/new?${searchParams.toString()}`;
      window.location.href = tenderlyUrl;
    } else {
      // If no parameters, just show success message
      alert('Values saved successfully! You will be redirected when parameters are provided.');
    }
  };

  const handleClear = () => {
    localStorage.removeItem('tenderlyUsername');
    localStorage.removeItem('tenderlyProjectSlug');
    setUsername('');
    setProjectSlug('');
    alert('Details cleared successfully!');
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Tenderly Redirect</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Enter your Tenderly account details below. You should be automatically redirected when parameters are provided.
      </p>
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <p style={{ marginBottom: '10px' }}>Need help finding these values?</p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Find your username in <a href="https://dashboard.tenderly.co/account/settings" target="_blank" rel="noopener noreferrer">Account Settings</a></li>
          <li>Find your project slug in <a href="https://dashboard.tenderly.co/account/projects" target="_blank" rel="noopener noreferrer">Projects</a></li>
          <li>Don't have a Tenderly account? <a href="https://dashboard.tenderly.co/register" target="_blank" rel="noopener noreferrer">Sign up here</a></li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tenderly Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            required
            placeholder="Enter your Tenderly username"
          />
        </div>
        <div>
          <label htmlFor="projectSlug" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Project Slug:</label>
          <input
            type="text"
            id="projectSlug"
            value={projectSlug}
            onChange={(e) => setProjectSlug(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            required
            placeholder="Enter your project slug"
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '12px', 
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            Save Details
          </button>
          <button
            type="button"
            onClick={handleClear}
            style={{
              flex: 1,
              padding: '12px', 
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
          >
            Clear Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default RedirectForm; 