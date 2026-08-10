import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import MaintenanceScreen from './components/MaintenanceScreen';
import Header from './components/Header';
import MainWebsite from './components/MainWebsite';
import AllProducts from './components/AllProducts';
import AllCombos from './components/AllCombos';
import ProductDetails from './components/ProductDetails';
import ComboDetails from './components/ComboDetails';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AnalyticsTracker from './components/AnalyticsTracker';
// Serverless Architecture - direct Firebase connection

const IS_MAINTENANCE_MODE = true;

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (IS_MAINTENANCE_MODE) {
    return <MaintenanceScreen />;
  }

  return (
    <Router>
      <AnalyticsTracker />
      <Header />
      <Routes>
        <Route path="/" element={<MainWebsite />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/combos" element={<AllCombos />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/combo/:id" element={<ComboDetails />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
