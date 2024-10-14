import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import GradientButton from '../components/GradientButton';
import { toast } from 'react-toastify';
import ErrorToast from '../components/ErrorToast';
import ConfirmPasswordInput from '../components/ConfirmPasswordInput';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, confirmSignUp, resendConfirmationCode, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (user) {
      navigate('/');
    } else if (location.state?.needConfirmation) {
      setIsSignUpComplete(true);
      setEmail(location.state.email);
    }

    const storedTimestamp = localStorage.getItem('resendTimestamp');
    if (storedTimestamp) {
      const elapsedTime = Date.now() - parseInt(storedTimestamp);
      if (elapsedTime < 30000) {
        setResendDisabled(true);
        setResendTimer(Math.ceil((30000 - elapsedTime) / 1000));
      }
    }
  }, [user, location, navigate]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await signUp(email, password);
      if (result) {
        setIsSignUpComplete(true);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(<ErrorToast message={error.message} />);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await confirmSignUp(email, confirmationCode);
      navigate('/');
    } catch (error) {
      console.error('Error confirming sign up:', error);
      toast.error(<ErrorToast message={error.message} />);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendDisabled(true);
    setResendTimer(30);
    try {
      await resendConfirmationCode(email);
      toast.success('Confirmation code resent successfully');
      localStorage.setItem('resendTimestamp', Date.now().toString());
    } catch (error) {
      console.error('Error resending confirmation code:', error);
      toast.error('Failed to resend confirmation code');
    }
  };

  return (
    <div className="min-h-screen w-full bg-primary flex items-center justify-center p-4">
      <div className="bg-primary p-8 rounded-lg w-full max-w-md">
        <h1 className="font-popp text-black text-5xl mb-6 text-center">
          {isSignUpComplete ? 'Confirm Email' : 'SIGN UP'}
        </h1>
        <form onSubmit={isSignUpComplete ? handleConfirmSubmit : handleSignUpSubmit} className="space-y-4">
          {isSignUpComplete ? (
            <>
              <EmailInput 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={true} 
              />
              <div>
                
                <input
                  id="confirmationCode"
                  type="text"
                  placeholder="Confirmation Code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="w-full mt-6 px-3 py-2 bg-white text-black font-pregular rounded-full border-2 border-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:outline-4"
                  required
                />
              </div>
              <GradientButton
                title={isLoading ? 'Confirming...' : 'Confirm'}
                onClick={handleConfirmSubmit}
                isLoading={isLoading}
              />
              <div className='mb-3 justify-center'> 
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendDisabled}
                  className={`mt-2 text-black hover:underline ${resendDisabled ? 'text-gray-500 opacity-60' : ''}`}
                >
                  {resendDisabled ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </>
          ) : (
            <>
              <EmailInput 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <PasswordInput 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder={'Password'}
              />
              <ConfirmPasswordInput 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder={'Confirm Password'}
              />
              <GradientButton
                title={isLoading ? 'Signing Up...' : 'Sign Up'}
                onClick={handleSignUpSubmit}
                isLoading={isLoading}
              />
            </>
          )}
        </form>
        <div className='mt-3'>
          <p className='font-pmedium text-black'>
            Already have an account? <Link to='/signin' className='text-black hover:underline cursor-pointer'> Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

