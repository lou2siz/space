import React, { useState } from 'react';
import './App.css';

function App() {
  const [websites, setWebsites] = useState([]);  // Stores the URLs for each iframe
  const [urlInput, setUrlInput] = useState('');  // Stores the URL input for adding a website

  const addWebsite = () => {
    if (urlInput.trim() !== '') {
      setWebsites([...websites, urlInput]);
      setUrlInput('');
    }
  };

  return (
    <div className="App">
      <h1>Multi Web Browser</h1>
      <div className="input-section">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter website URL"
        />
        <button onClick={addWebsite}>+</button>
      </div>

      <div className="grid-container">
        {websites.map((url, index) => (
          <div key={index} className="iframe-container">
            <iframe 
              src={url} 
              title={`website-${index}`} 
              className="iframe" 
              frameBorder="0" 
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
