import React from 'react';
import UserHeader from '../components/UserHeader';
const About = () => {

    return(
        <div className='bg-primary  '>
            <UserHeader/>

            <div className='font-popp text-xl text-center mb-6 z-0 relative min-h-screen w-full bg-primary flex flex-col items-center justify-center '>

            <p>
            Welcome to LearnLab, your personalized learning companion for Computer Science students.
             Our mission is to revolutionize the way students approach their studies by providing an interactive, 
             AI-powered chatbot designed to assist and guide learners throughout their academic journey
            </p>
<br/>
            <p>
            At LearnLab, we understand the challenges CS students face, from coding complexities to theoretical concepts.
             Our intelligent chatbot is here to provide instant help with a wide range of topics including programming,
              algorithms, data structures, software development, and much more. Whether you're debugging code, preparing for exams,
               or just need clarification on key concepts, LearnLab is available 24/7 to support your learning needs.
            </p>
<br/>
            <p>
            Our platform is created by a team of passionate Software Engineering seniors who aim to bridge the gap between traditional learning and modern technology.
             By combining personalized assistance with the flexibility of an AI-driven tool, 
             we aim to make learning more accessible, efficient, and enjoyable for every student
            </p>
<br/>
            <p>
            Join us at LearnLab, where learning meets innovation!
            </p>
            </div>
        </div>

    );

};

export default About;

