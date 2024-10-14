import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import ErrorToast from '../components/ErrorToast';
import { toast } from 'react-toastify';
import GradientButton from '../components/GradientButton';
import EmailInput from '../components/EmailInput';
import Home from './Home';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.nextStep.signInStep === "CONFIRM_SIGN_UP") {
        navigate('/signup', { state: { email, needConfirmation: true } });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(<ErrorToast message={error.message} />);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-primary flex items-center justify-center p-4">
      <div className="bg-primary p-8 rounded-lg  w-full max-w-md">
        <h1 className="font-popp text-black text-5xl mb-6 text-center">
          LOG IN
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
          <div>
      <input
        type="password"
        id="password"
         placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
        className={"w-full mt-2 mb-5 px-3 py-2 bg-white text-black font-pregular rounded-full border-2 border-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:outline-4"}
        required
      />


    </div>  
    
            <GradientButton
            title="LOG IN"
            onClick={handleSubmit}
            isLoading={isLoading}
          />
        </form>

        <div className='mt-10 flex items-center space-x-16'>

        <Link to='/signup' className='text-black hover:underline cursor-pointer whitespace-nowrap'> Don't have an account?</Link>

        <Link to="/forgot" className='text-black hover:underline cursor-pointer whitespace-nowrap'>Forgotten your password?</Link>
    
      </div>

      </div>
    </div>
  );
};

export default SignIn;