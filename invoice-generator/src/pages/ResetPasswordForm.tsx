import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/reset-password/${token}`, { newPassword });
      setSuccessMessage('Password reset successfully.');
      setNewPassword('')
      setConfirmPassword('')

    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to reset password. Please try again.');
      setNewPassword('')
      setConfirmPassword('')
    }
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded mb-4"
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={handleResetPassword}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPasswordForm;
