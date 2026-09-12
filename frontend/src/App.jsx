import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SystemStatusProvider } from './context/SystemStatusContext';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Dashboard } from './pages/Dashboard';
import { Optimizer } from './pages/Optimizer';
import { Forecast } from './pages/Forecast';
import { Battery } from './pages/Battery';
import { Loads } from './pages/Loads';
import { Fuel } from './pages/Fuel';
import { Simulator } from './pages/Simulator';

export function App() {
  return (
    <SystemStatusProvider>
      <Router>
        <Layout>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/optimizer" element={<Optimizer />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/battery" element={<Battery />} />
              <Route path="/loads" element={<Loads />} />
              <Route path="/fuel" element={<Fuel />} />
              <Route path="/simulator" element={<Simulator />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
      </Router>
    </SystemStatusProvider>
  );
}

export default App;
