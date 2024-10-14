import React from 'react';
import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import Loading from '../components/Loading';

const Practice = () => {
    const [displayedText, setDisplayedText] = useState('');
    const [isVisible, setIsVisible] = useState(true); // State to control visibility
    const text = "It's time to practice! \n Good Luck!";
    const speed = 100; // Speed of typing in milliseconds
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let index = 0;
        let currentText = ''; // Ensure a clean starting point for the text

        const type = () => {
            if (index < text.length) {
                currentText += text.charAt(index);
                setDisplayedText(currentText); // Update state only once per call
                index++;
                setTimeout(type, speed); // Schedule the next character
            }
        };

        type(); // Start typing

        // Cleanup to prevent multiple intervals from being set
        return () => {
            index = text.length; // Stop typing on component unmount
        };
    }, [text, speed]);

    useEffect(() => {
        // Set a timeout to hide the content after 4 seconds
        const timer = setTimeout(() => {
            setIsVisible(false); // Set visibility to false
        }, 4500);

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <UserHeader />

            {isVisible ? ( // Conditionally render the entire block if isVisible is true
                <div className='flex-grow flex items-center justify-center'>
                    <div className="w-32 h-32 flex-grow flex items-center justify-start border-t-4 border-b-4 border-black">
                        <dotlottie-player
                            src="https://lottie.host/a066ad9d-8da0-49fe-a638-f5741ccbd96f/Y15NyC3Fbb.json"
                            background="transparent"
                            speed="1"
                            style={{ width: '600px', height: '600px' }}
                            loop
                            autoplay
                        />
                        <div className='font-pbold text-black text-3xl text-center whitespace-pre-wrap uppercase'>
                            {displayedText}
                        </div>
                    </div>
                </div>
            ) : (

<div className='flex-grow flex items-center justify-center'>
    <div className='bg-white p-4 border-2 border-secondary rounded-lg h-96 flex flex-col'>
    
                    </div>
                </div>

 )} ;
        </div>
           
    );
};

export default Practice;
