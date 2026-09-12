import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SystemStatusProvider } from './context/SystemStatusContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Optimizer } from './pages/Optimizer';
import { Forecast } from './pages/Forecast';
import { Battery } from './pages/Battery';
import { Loads } from './pages/Loads';
import { Fuel } from './pages/Fuel';
import { Simulator } from './pages/Simulator';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <Router>
      <SystemStatusProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/optimizer" element={<Optimizer />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/battery" element={<Battery />} />
            <Route path="/loads" element={<Loads />} />
            <Route path="/fuel" element={<Fuel />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </SystemStatusProvider>
    </Router>
  );
}

export default App;
