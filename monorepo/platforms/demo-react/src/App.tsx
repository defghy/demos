import React, { useState, useMemo, useEffect, createContext } from 'react';
import logo from './logo.svg';
import './App.css';

import Count from './components/Count';

export const AppContext = createContext(0);

function App() {

  const [ count, updateCount ] = useState(0);
  const [ timer ] = useState(Date.now());
  const addCount = function() {
    updateCount(count + 1);
  };

  // watch
  useEffect(() => {
    console.log('Count changed:', count);
    return () => {
      // 清理操作
      console.log('Cleaning up');
    };
  }, [count]); // 仅在 count 发生变化时执行

  // provide, inject


  return (
    <AppContext.Provider value={timer}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Count count={count} onUpdate={addCount}></Count>
        </header>
      </div>
    </AppContext.Provider>
  );
}

export default App;
