import React, { useState } from 'react';
import './App.css';

function App() {
  const [websites, setWebsites] = useState([]);
  const [urlInput, setUrlInput] = useState('');

  const formatUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const addWebsite = () => {
    if (urlInput.trim() !== '') {
      const formattedUrl = formatUrl(urlInput.trim());
      setWebsites([...websites, formattedUrl]);
      setUrlInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addWebsite();
    }
  };

  const removeWebsite = (index) => {
    const newWebsites = websites.filter((_, i) => i !== index);
    setWebsites(newWebsites);
  };

  return (
    <div className="App">
      <h1>Multi Web Browser</h1>
      <div className="input-section">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter website URL (e.g., google.com)"
        />
        <button onClick={addWebsite}>Add Website</button>
      </div>

      <div className="grid-container">
        {websites.map((url, index) => (
          <div key={index} className="iframe-wrapper">
            <div className="iframe-header">
              <span className="iframe-url">{url}</span>
              <button 
                className="close-button"
                onClick={() => removeWebsite(index)}
              >
                ×
              </button>
            </div>
            <div className="iframe-container">
              <iframe
                src={url}
                title={`website-${index}`}
                className="iframe"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
