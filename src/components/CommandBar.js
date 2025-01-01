import React, { useState } from 'react';
import './CommandBar.css';

const CommandBar = ({ onCommand }) => {
  const [command, setCommand] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const input = command.toLowerCase().trim();
    
    // Handle search commands
    if (input.startsWith('search')) {
      const query = command.slice(7).trim(); // Remove 'search ' from the start
      if (query) {
        onCommand({
          action: 'open',
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`
        });
      }
    }
    // Handle show/watch commands for YouTube
    else if (input.startsWith('show') || input.startsWith('watch')) {
      const query = command.split(/show|watch/i)[1].trim();
      if (query) {
        onCommand({
          action: 'open',
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
        });
      }
    }
    // Handle direct open commands
    else if (input.startsWith('open')) {
      const url = command.slice(5).trim(); // Remove 'open ' from the start
      if (url) {
        onCommand({
          action: 'open',
          url: url.startsWith('http') ? url : `https://${url}`
        });
      }
    }
    
    setCommand('');
  };

  return (
    <div className="command-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Try: 'search lebron' or 'show lebron highlights'"
        />
        <button type="submit">Execute</button>
      </form>
    </div>
  );
};

export default CommandBar; 