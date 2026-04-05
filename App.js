import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ClinicalForm from './components/ClinicalForm';
import LifestyleForm from './components/LifestyleForm';
import DataValidation from './components/DataValidation';
import PredictionResult from './components/PredictionResult';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="medical-theme">
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/clinical"
              element={isAuthenticated ? <ClinicalForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/lifestyle"
              element={isAuthenticated ? <LifestyleForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/validate"
              element={isAuthenticated ? <DataValidation /> : <Navigate to="/login" />}
            />
            <Route
              path="/prediction"
              element={isAuthenticated ? <PredictionResult /> : <Navigate to="/login" />}
            />
            <Route
              path="/analytics"
              element={isAuthenticated ? <AnalyticsDashboard /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;