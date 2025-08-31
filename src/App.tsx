import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Banner from './components/Banner';
import ProductGrid from './components/ProductGrid';
import AdminPanel from './components/AdminPanel';
import QuickActions from './components/QuickActions';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import Profile from './components/Profile';
import Wishlist from './components/Wishlist';
import SearchPage from './components/SearchPage';

function AppContent() {
  const { state, dispatch } = useApp();
  const [showCheckout, setShowCheckout] = useState(false);

  // Handle different pages
  if (state.isAdminMode) {
    return <AdminPanel />;
  }

  if (showCheckout) {
    return <Checkout onBack={() => setShowCheckout(false)} />;
  }

  if (state.currentPage === 'orders') {
    return <OrderHistory />;
  }

  if (state.currentPage === 'profile') {
    return <Profile />;
  }

  if (state.currentPage === 'wishlist') {
    return <Wishlist />;
  }

  if (state.currentPage === 'search') {
    return <SearchPage initialQuery={state.searchQuery} />;
  }

  // Default home page
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-8">
          <Banner />
          <ProductGrid />
        </div>
      </main>

      <Footer />
      <QuickActions onCheckout={() => setShowCheckout(true)} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;