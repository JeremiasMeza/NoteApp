import React, { useState } from 'react';
import Welcome from './views/Welcome';
import Home from './views/Home';

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {started ? (
        <Home />
      ) : (
        <Welcome onEnter={() => setStarted(true)} />
      )}
    </>
  );
}
