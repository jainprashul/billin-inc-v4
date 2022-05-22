import React, { useEffect } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './styles/App.css';
import { DataTesting } from './components';

function App() {
  return (
    <div className="App">
      <DataTesting />
    </div>
  );
}

export default App;
