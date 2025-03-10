import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HelloWorld() {
  const [message, setMessage] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/api/hello-world/`)
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Hello, World!</h1>
      <p>{message}</p>
    </div>
  );
}

export default HelloWorld;