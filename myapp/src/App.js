import React from 'react';
import HelloWorld from './components/HelloWorld';
import Navbar from './components/Navbar';


function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>
      </div>
      <div>
        <HelloWorld />
      </div>
    </>
  );
}

export default App;
