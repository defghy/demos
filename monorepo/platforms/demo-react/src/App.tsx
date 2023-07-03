import React, { useState, useMemo, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [ count, updateCount ] = useState(0);
  const addCount = function() {
    updateCount(count + 1);
  };
  const countStr = useMemo(() => {
    return `数字为：${count}`;
  }, [count]);
  useEffect(() => {
    console.log('Count changed:', count);
    return () => {
      // 清理操作
      console.log('Cleaning up');
    };
  }, [count]); // 仅在 count 发生变化时执行


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={addCount}>add</button>
        <div>{countStr}</div>
      </header>
    </div>
  );
}

export default App;
