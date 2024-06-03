import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddProductPage from './pages/AddProductPage';
import ReceiptPage from './pages/ReceiptPage';
import ResetPasswordForm from './pages/ResetPasswordForm';
import Header from './components/Header';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
  }, [location]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-product" element={isLoggedIn ? <AddProductPage /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/receipt" element={isLoggedIn ? <ReceiptPage /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
      </Routes>
    </div>
  );
};

export default App;
