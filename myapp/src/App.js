import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HelloWorld from './components/HelloWorld';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/hello" element={<HelloWorld />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
