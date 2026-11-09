import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import AnalyticsTracker from './components/AnalyticsTracker';

// Code-split routes for optimal performance
const MainWebsite = lazy(() => import('./components/MainWebsite'));
const AllProducts = lazy(() => import('./components/AllProducts'));
const AllCombos = lazy(() => import('./components/AllCombos'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const ComboDetails = lazy(() => import('./components/ComboDetails'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const App = () => {
  return (
    <Router>
      <AnalyticsTracker />
      <Header />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<MainWebsite />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/combos" element={<AllCombos />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/combo/:id" element={<ComboDetails />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
