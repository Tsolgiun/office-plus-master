import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoute from './components/AdminRoute/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Home from './pages/Home/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PropertyDetail from './pages/PropertyDetail/PropertyDetail';
import UserProfile from './pages/UserProfile/UserProfile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/office/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
