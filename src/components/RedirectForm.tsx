import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import pako from 'pako';

const STORAGE_KEY_USERNAME = 'tenderlyUsername';
const STORAGE_KEY_PROJECT = 'tenderlyProjectSlug';

function decompressQueryString(compressed: string): string {
  const base64 = compressed
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(compressed.length + (4 - (compressed.length % 4)) % 4, '=');

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const decompressed = pako.inflate(bytes);
  return String.fromCharCode.apply(null, Array.from(decompressed));
}

function resolveQueryString(searchParams: URLSearchParams): string {
  const compressed = searchParams.get('q');
  if (compressed) {
    try {
      return decompressQueryString(compressed);
    } catch {
      return '';
    }
  }

  const params = new URLSearchParams(searchParams);
  params.delete('q');
  return params.toString();
}

function buildTenderlyUrl(username: string, projectSlug: string, queryString: string): string {
  return `https://dashboard.tenderly.co/${username}/${projectSlug}/simulator/new?${queryString}`;
}

const RedirectForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [projectSlug, setProjectSlug] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  // Load persisted credentials on mount
  useEffect(() => {
    document.title = 'Redirecting to Tenderly...';
    const storedUsername = localStorage.getItem(STORAGE_KEY_USERNAME);
    const storedProject = localStorage.getItem(STORAGE_KEY_PROJECT);
    if (storedUsername) setUsername(storedUsername);
    if (storedProject) setProjectSlug(storedProject);
  }, []);

  // Handle reset path
  useEffect(() => {
    if (searchParams.get('path') === '/reset') {
      localStorage.removeItem(STORAGE_KEY_USERNAME);
      localStorage.removeItem(STORAGE_KEY_PROJECT);
      setUsername('');
      setProjectSlug('');
      navigate('/tdly-redirect');
    }
  }, [searchParams, navigate]);

  // Auto-redirect when credentials and query params are both present
  useEffect(() => {
    const storedUsername = localStorage.getItem(STORAGE_KEY_USERNAME);
    const storedProject = localStorage.getItem(STORAGE_KEY_PROJECT);
    const queryString = resolveQueryString(searchParams);

    if (storedUsername && storedProject && queryString) {
      window.location.href = buildTenderlyUrl(storedUsername, storedProject, queryString);
    }
  }, [searchParams]);

  const saveCredentials = (user: string, project: string) => {
    localStorage.setItem(STORAGE_KEY_USERNAME, user);
    localStorage.setItem(STORAGE_KEY_PROJECT, project);
  };

  const clearCredentials = () => {
    localStorage.removeItem(STORAGE_KEY_USERNAME);
    localStorage.removeItem(STORAGE_KEY_PROJECT);
    setUsername('');
    setProjectSlug('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !projectSlug) return;

    saveCredentials(username, projectSlug);

    const queryString = resolveQueryString(searchParams);
    if (queryString) {
      window.location.href = buildTenderlyUrl(username, projectSlug, queryString);
    } else {
      setStatusMessage({
        text: 'Details saved. You will be redirected automatically when simulation parameters are provided.',
        type: 'success',
      });
    }
  };

  const handleClear = () => {
    clearCredentials();
    setStatusMessage({ text: 'Details cleared.', type: 'success' });
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1>Tenderly Redirect</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Enter your Tenderly account details below. You will be automatically redirected when simulation parameters are provided.
      </p>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <p style={{ marginBottom: '10px' }}>Need help finding these values?</p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Find your username in <a href="https://dashboard.tenderly.co/account/settings" target="_blank" rel="noopener noreferrer">Account Settings</a></li>
          <li>Find your project slug in <a href="https://dashboard.tenderly.co/account/projects" target="_blank" rel="noopener noreferrer">Projects</a></li>
          <li>Don't have a Tenderly account? <a href="https://dashboard.tenderly.co/register" target="_blank" rel="noopener noreferrer">Sign up here</a></li>
        </ul>
      </div>

      {statusMessage && (
        <div style={{
          marginBottom: '15px',
          padding: '12px',
          borderRadius: '4px',
          backgroundColor: statusMessage.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: statusMessage.type === 'success' ? '#2e7d32' : '#c62828',
          border: `1px solid ${statusMessage.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`,
        }}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Tenderly Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            required
            placeholder="Enter your Tenderly username"
          />
        </div>

        <div>
          <label htmlFor="projectSlug" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Project Slug:
          </label>
          <input
            type="text"
            id="projectSlug"
            value={projectSlug}
            onChange={(e) => setProjectSlug(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
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
            }}
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
            }}
          >
            Clear Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default RedirectForm;
