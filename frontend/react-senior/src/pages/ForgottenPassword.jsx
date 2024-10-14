// src/pages/ForgottenPassword.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import ErrorToast from '../components/ErrorToast';
import { toast } from 'react-toastify';
import GradientButton from '../components/GradientButton';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import ConfirmPasswordInput from '../components/ConfirmPasswordInput';

const ForgottenPassword = () => {
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState('request');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false); // State for code confirmation
  const [isCodeDisabled, setIsCodeDisabled] = useState(false); // New state to disable confirmation code input
  const { resetPassword, confirmResetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email);
      toast.success('Password reset code sent. Check your email.');
      setStage('confirm');
    } catch (error) {
      toast.error(<ErrorToast message={error.message} />);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setIsCodeDisabled(true); // Disable the confirmation code input field
    setIsCodeConfirmed(true); // Set the flag for showing password inputs
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();

    // Validate that passwords match
    if (newPassword !== confirmPassword) {
      toast.error(<ErrorToast message="Passwords do not match." />);
      return;
    }

    setIsLoading(true);
    try {
      // Trim the confirmation code to avoid extra spaces
      const trimmedCode = confirmationCode.trim();

      await confirmResetPassword(email, trimmedCode, newPassword);
      toast.success('Password reset successful. You can now sign in with your new password.');
      navigate('/signin');
    } catch (error) {
      toast.error(<ErrorToast message={error.message} />);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-primary flex items-center justify-center p-4">
      <div className="bg-primary p-8 rounded-lg w-full max-w-md">
        <h1 className="font-popp text-black text-5xl mb-6 text-center">
          Forgot Password
        </h1>
        {stage === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
            <GradientButton
              title="SEND CODE"
              onClick={handleRequestReset}
              isLoading={isLoading}
            />
          </form>
        ) : (
          <form onSubmit={isCodeConfirmed ? handleConfirmReset : handleConfirmCode} className="space-y-4">
            <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} disabled />
            
            <div>
              <input
                type="text"
                id="confirmationCode"
                placeholder="Confirmation Code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="w-full mt-2 px-3 py-2 bg-white text-black font-pregular rounded-full border-2 border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                disabled={isCodeDisabled}  // Disable this input after confirming the code
              />
            </div>

            {!isCodeConfirmed ? (
              <GradientButton
                title="VERIFY"
                onClick={handleConfirmCode}
                isLoading={isLoading}
              />
            ) : (
              <>
                <PasswordInput
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <ConfirmPasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <GradientButton
                  title="RESET PASSWORD"
                  onClick={handleConfirmReset}
                  isLoading={isLoading}
                />
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgottenPassword;



