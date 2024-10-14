// src/pages/Home.jsx

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import createAuthenticatedApi from '../utils/api';
import { toast } from 'react-toastify';
import ErrorToast from '../components/ErrorToast';
import Header from '../components/Header';
import LottieAnimation from '../components/LottieAnimation';
import Background from '../components/Background';

const Home = () => {
  const { user, signOut, getSession } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [api, setApi] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    } else {
      const authenticatedApi = createAuthenticatedApi(getSession);
      setApi(authenticatedApi);
    }
  }, [user, navigate, getSession]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const handleSelect = (department, courseId) => {
    console.log(`Selected Department: ${department}, Course ID: ${courseId}`);
    setSelectedCourse(courseId);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      toast.error(<ErrorToast message='Please select a course.'/>);
      return;
    }
    setIsLoading(true);
    try {
      await api.get(`/load_database?course=${selectedCourse}`);
      navigate('/chat', { state: { courseId: selectedCourse } });
    } catch (error) {
      console.error('Error:', error);
      toast.error(<ErrorToast message="Error loading database. Please try again." />);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen w-full bg-primary ">
      <Header/>
  
      <div className="min-h-screen w-full bg-primary flex flex-col items-center justify-center ">

  <div className="absolute z-0">
    <Background /> 
  </div>
  
  <h1 className="font-psemibold text-black text-3xl mb-6 text-center z-0 relative">
    Welcome to LearnLab <br/>
    Elevating Education with AI Innovation
  </h1>
</div>

        <div className="w-full flex justify-center items-start max-w-screen-lg mt-20 mx-auto p-4">
 
  <div className="w-1/2 p-4">
    <h1 className="font-psemibold text-black text-4xl mb-6 text-center underline underline-offset-0 decoration-8 decoration-green">
      CHAT BOT
    </h1>
    <p className="font-popp text-center uppercase">
      You can ask any question at anytime<br />
      about any IT course in your major plan,<br />
      the chat bot will answer these<br />
      questions and will also give you some<br />
      practices about the course.
    </p>
    <Link to="/chatbot1" className='font-psemibold text-black text-2xl mt-4 text-center uppercase block'>
      Go to chat bot &gt;&gt;
    </Link>
  </div>

  <div className="w-1/2 -mt-28">
    <LottieAnimation/>
  </div>
</div>

    </div>
  );
  
};

export default Home;
