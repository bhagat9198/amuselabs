import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import '@/styles/css/style.css';
import '@/components/charts/ChartjsConfig';
import HomePage from '@/pages/home';


function App() {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
