import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HelloWorld from './components/HelloWorld';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/hello" element={<HelloWorld />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
