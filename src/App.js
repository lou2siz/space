import React, { useState } from 'react';
import './App.css';
import CommandBar from './components/CommandBar';

function App() {
  const [websites, setWebsites] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [minimizedSites, setMinimizedSites] = useState({});
  const [customSizes, setCustomSizes] = useState({});

  const isElectron = window.electron !== undefined;

  const formatUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    // Only use proxy if we're not in Electron
    if (!isElectron) {
      return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
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

  const toggleMinimize = (index) => {
    setMinimizedSites(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleResize = (index, size) => {
    setCustomSizes(prev => ({
      ...prev,
      [index]: size
    }));
  };

  const handleCommand = (command) => {
    switch (command.action) {
      case 'open':
        const formattedUrl = formatUrl(command.url);
        setWebsites(prev => [...prev, formattedUrl]);
        break;

      case 'minimize':
        toggleMinimize(command.index);
        break;

      case 'resize':
        handleResize(command.index, command.size);
        break;

      case 'close':
        removeWebsite(command.index);
        break;

      default:
        console.warn('Unknown command:', command);
    }
  };

  return (
    <div className="App">
      <CommandBar onCommand={handleCommand} />
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
          <div 
            key={index} 
            className={`iframe-wrapper ${minimizedSites[index] ? 'minimized' : ''}`}
            style={customSizes[index] ? { width: customSizes[index].width, height: customSizes[index].height } : {}}
          >
            <div className="iframe-header">
              <span className="iframe-url">{url}</span>
              <div className="iframe-controls">
                <select 
                  onChange={(e) => handleResize(index, JSON.parse(e.target.value))}
                  className="size-selector"
                >
                  <option value='{"width":"400px","height":"400px"}'>Default</option>
                  <option value='{"width":"800px","height":"600px"}'>Large</option>
                  <option value='{"width":"1024px","height":"768px"}'>Extra Large</option>
                </select>
                <button 
                  className="control-button minimize-button"
                  onClick={() => toggleMinimize(index)}
                >
                  {minimizedSites[index] ? '□' : '−'}
                </button>
                <button 
                  className="control-button close-button"
                  onClick={() => removeWebsite(index)}
                >
                  ×
                </button>
              </div>
            </div>
            {isElectron ? (
              // Use webview for Electron
              <webview
                src={url}
                style={{ width: '100%', height: '100%' }}
                allowpopups="true"
              />
            ) : (
              // Use iframe for web browser
              <iframe
                src={formatUrl(url)}
                title={`frame-${index}`}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                onError={(e) => {
                  e.target.srcdoc = `
                    <div style="padding: 20px; text-align: center;">
                      <h3>Unable to load ${url}</h3>
                      <p>This website may not allow embedding in iframes.</p>
                      <p>For best experience, please use our desktop app.</p>
                      <a href="${url}" target="_blank">Open in new tab</a>
                    </div>
                  `;
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
